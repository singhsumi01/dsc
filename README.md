# DSC Registration SaaS - Production Deployment Guide

## 📁 Repository Structure
```
/dsc-saas-app    # Next.js Frontend
/gas             # Google Apps Script Backend (Code.gs, Setup.gs, etc.)
```

## 🚀 Backend Deployment (Google Apps Script)

1. Create a new [Google Sheet](https://sheets.new).
2. Extensions > Apps Script.
3. Copy all files from `/gas` into the script editor.
4. Run `setupDatabase()` to initialize sheets and create default Super Admin (`admin@dscsaas.com` / `admin123`).
5. **Deploy > New Deployment**:
   - Type: Web App
   - Execute as: Me
   - Who has access: Anyone (to allow Next.js serverless function access)
6. Copy the **Web App URL**.

## 🌐 Frontend Deployment (Vercel)

1. Push the `/dsc-saas-app` content to a **GitHub Repository**.
2. Connect the repository to [Vercel](https://vercel.com).
3. Configure **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Paste your GAS Web App URL.
   - `NEXT_PUBLIC_RAZORPAY_KEY`: Your Razorpay Live Key.
   - `NEXT_PUBLIC_PAYU_KEY`: Your PayU Merchant Key.
4. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`

## 🔐 Role Based Access Control (RBAC)

- **Super Admin**: Full system control.
- **Admin**: Application management (based on permissions).
- **Agent**: Client application management on behalf of users.
- **Client**: Individual application dashboard.

## 🛠️ Webhook Configuration

For Razorpay/PayU, set the Webhook URL to: 
`[YOUR_GAS_WEBAPP_URL]?action=payment/webhook`

---
*Created by Antigravity for DSC SaaS Inc.*
# dsc
# dsc
