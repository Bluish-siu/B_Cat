# Deploying to the Hostinger VPS

The website runs on the organization's Hostinger VPS as a small Node.js server (`server.js`) behind Nginx, with free HTTPS from Let's Encrypt. The code comes from the organization GitHub repo `branding-catalyst-pvt-ltd/Branding_Catalyst`.

```
Visitor → brandingcatalyst.in → Nginx (HTTPS, port 443) → server.js (port 3000, kept alive by PM2)
                                                            ├── public/      the website pages
                                                            ├── /api/arc     ARC AI (Claude)
                                                            └── /api/lead    leads → email + Google Sheet
```

Commands below assume **Ubuntu** (Hostinger's default VPS template) and that you are logged in as `root`. Lines starting with `#` are notes, not commands.

> **If the VPS uses a control panel** (CloudPanel, CyberPanel, Coolify, etc.) or already hosts other sites with Nginx/Apache, tell the developer first. The steps change slightly so nothing else on the server is affected.

## What you need

- The VPS **IP address** and **root password or SSH key** (hPanel → VPS → Overview / SSH access)
- Access to the **organization GitHub** repo (admin, to add a deploy key)
- Access to **Hostinger DNS** for brandingcatalyst.in
- Your keys and passwords for `.env`: Anthropic API key, hello@ mailbox password, Google Sheet URL and secret

## 1. Log in to the VPS

From Windows PowerShell (or hPanel → VPS → **Browser terminal**):

```bash
ssh root@YOUR_VPS_IP
```

## 2. Install Node.js, Nginx, Git and PM2 (one time)

```bash
apt update && apt upgrade -y
apt install -y git nginx curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2
node -v    # should print v22.x
```

Firewall (skip if Hostinger's firewall is managed in hPanel instead):

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

## 3. Give the VPS read access to the private GitHub repo

Create a key on the VPS:

```bash
ssh-keygen -t ed25519 -C "bcat-vps-deploy" -f ~/.ssh/bcat_deploy -N ""
cat ~/.ssh/bcat_deploy.pub
```

Copy the line it prints. On GitHub: **branding-catalyst-pvt-ltd/Branding_Catalyst → Settings → Deploy keys → Add deploy key**, title `Hostinger VPS`, paste it, leave **Allow write access unticked**, save.

Tell SSH to use that key for GitHub:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/bcat_deploy
  IdentitiesOnly yes
EOF
ssh -T git@github.com    # type "yes" once; it should say you've authenticated
```

## 4. Download the website

```bash
mkdir -p /var/www && cd /var/www
git clone git@github.com:branding-catalyst-pvt-ltd/Branding_Catalyst.git brandingcatalyst
cd brandingcatalyst
npm ci --omit=dev
```

## 5. Add the secret settings (.env)

```bash
cp .env.example .env
nano .env
```

Fill in (leave unused lines empty):

```
ANTHROPIC_API_KEY=sk-ant-...            # ARC AI + lead cards
SMTP_USER=hello@brandingcatalyst.in     # lead email sender
SMTP_PASS=the hello@ mailbox password
LEAD_TO_EMAIL=hello@brandingcatalyst.in
HR_EMAIL=hr@brandingcatalyst.in
LEADS_SHEET_URL=https://script.google.com/...   # after the Google Sheet setup (docs/SETUP.md)
LEADS_SHEET_SECRET=your secret phrase
```

Save with **Ctrl+O, Enter**, exit with **Ctrl+X**, then lock the file so only root can read it:

```bash
chmod 600 .env
```

`.env` never goes to GitHub (it is in `.gitignore`).

## 6. Start the website

```bash
pm2 start deploy/ecosystem.config.cjs
pm2 startup          # run the command it prints, so the site starts after a reboot
pm2 save
curl -s localhost:3000 | head -c 200    # should print the start of the homepage
pm2 logs bcat-website --lines 5         # shows "ARC AI: on · Lead email: SMTP ..."
```

If port 3000 is already used on the VPS, change `PORT` in `deploy/ecosystem.config.cjs` and `proxy_pass` in the Nginx file to another port (e.g. 3100).

## 7. Nginx

```bash
cp deploy/nginx-brandingcatalyst.conf /etc/nginx/sites-available/brandingcatalyst.in
ln -s /etc/nginx/sites-available/brandingcatalyst.in /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default     # only if no other site uses the default
nginx -t && systemctl reload nginx
```

## 8. Point the domain to the VPS (Hostinger DNS)

Today brandingcatalyst.in shows the **old one-page site** on Hostinger's web hosting (through Hostinger's CDN). Switching DNS moves visitors to the new site on the VPS. Before switching:

1. **Back up the old site**: hPanel → Websites → brandingcatalyst.in → File manager → download `public_html` (or Backups → download). Keep it in case anything needs to be checked later.
2. **Test the new site on the VPS first** (steps 1–7). From your computer, open `http://YOUR_VPS_IP`; Nginx answers only for the domain, so instead run on the VPS: `curl -s -H "Host: brandingcatalyst.in" localhost | head -c 300`.
3. **Turn off Hostinger CDN** for the domain (hPanel → Websites → brandingcatalyst.in → Performance → CDN → off). Otherwise the CDN can keep serving the old site.

Old addresses keep working: `/services.html` is the new Services page, and `/collaborate.html`, `/privacy-policy.html` and `/index.html` redirect permanently to the new pages (see `REDIRECTS` in `server.js`).

Then change the DNS records:

hPanel → **Domains → brandingcatalyst.in → DNS / Nameservers → DNS records**:

| Type | Name | Points to | TTL |
|---|---|---|---|
| A | `@` | YOUR_VPS_IP | 3600 |
| CNAME | `www` | `brandingcatalyst.in` | 3600 |

Edit the existing `@` and `www` records. **Delete any `AAAA` record for `@` or `www`** (the old hosting has one; the VPS IPv6 can be added later), otherwise some visitors still reach the old site. **Do not change the MX or TXT records**; they run hello@ and hr@ email (mx1/mx2.hostinger.in).

Check (from any computer, after a few minutes): `nslookup brandingcatalyst.in` should show the VPS IP.

## 9. HTTPS (free certificate)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d brandingcatalyst.in -d www.brandingcatalyst.in --redirect -m hello@brandingcatalyst.in --agree-tos -n
```

The certificate renews itself automatically. Open **https://brandingcatalyst.in**; the site should load with the padlock.

## 10. After it's live

- Tell the developer "the domain is live". They switch `SITE_URL` to `https://brandingcatalyst.in` so canonical links, the sitemap and share tags use the real domain, then you run the update below.
- Test: submit the "Start a project" form and an ARC chat with your own number. A lead email should arrive at hello@.
- Then retire the old copies: remove the project from the personal Vercel account, and make the personal GitHub repo `Bluish-siu/B_Cat` private or delete it.

## Updating the site later

Whenever new changes are pushed to the organization repo:

```bash
ssh root@YOUR_VPS_IP
cd /var/www/brandingcatalyst && bash deploy/update.sh
```

It downloads the latest code, installs packages and restarts the server with no downtime. After editing `.env`, run `pm2 reload bcat-website --update-env`.

## Useful commands

| What | Command |
|---|---|
| Is it running? | `pm2 status` |
| Live logs (leads show as `LEAD`) | `pm2 logs bcat-website` |
| Restart | `pm2 reload bcat-website` |
| Nginx errors | `tail -n 50 /var/log/nginx/error.log` |
| Renew HTTPS test | `certbot renew --dry-run` |
