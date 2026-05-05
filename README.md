# Salon Feedback Form

A modern, responsive customer feedback form for premium salon brands with two sub-brands: **American Hairline** and **Alchemane**. Built with React and Tailwind CSS on the frontend, and Google Apps Script for the backend.

## Project Structure

```
salon-feedback-form/
├── src/
│   ├── components/
│   │   ├── FeedbackForm.jsx      # Main feedback form with progressive disclosure
│   │   └── SuccessScreen.jsx     # Success/thank you screen with conditional messaging
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind styles
├── Code.gs                        # Google Apps Script backend
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── .env.local                     # Environment variables
└── index.html                     # HTML entry point
```

## Features

### Frontend
- **Progressive Disclosure**: Form fields reveal dynamically based on user input
- **Dynamic Branding**: Logos highlight based on gender selection
- **Conditional Routing**: Different follow-up questions based on satisfaction rating
- **Responsive Design**: Mobile-first, works on all devices
- **Premium UI**: Deep navy blue theme with card-based layout
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Visual feedback during submission

### Backend
- **Google Apps Script API**: Serverless backend using Google's cloud
- **Automatic Sheet Creation**: Creates FeedbackData sheet if it doesn't exist
- **CORS Support**: Properly configured headers for cross-origin requests
- **Error Handling**: Comprehensive error logging and responses
- **Health Check**: `/doGet` endpoint to verify deployment

## Setup Instructions

### Part 1: Frontend (React Application)

#### Prerequisites
- Node.js 16+ and npm installed

#### Installation & Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment configuration:**
   
   Update `.env.local` with your Google Apps Script URL:
   ```
   VITE_GAS_API_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Deploy to Vercel:**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Vercel will auto-detect the Vite configuration and deploy
   - Your app will be live at `https://your-domain.vercel.app`

### Part 2: Backend (Google Apps Script)

#### Setup Instructions

1. **Create a Google Sheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet named "Salon Feedback"
   - Note the Sheet ID from the URL

2. **Create Google Apps Script project:**
   - Open your Google Sheet
   - Click **Extensions > Apps Script**
   - Delete the default code

3. **Add the backend code:**
   - Copy the contents of `Code.gs`
   - Paste it into the Apps Script editor
   - Save the project with name "Salon Feedback API"

4. **Deploy as web app:**
   - Click **Deploy** > **New Deployment**
   - Select **Type** > **Web app**
   - Set **Execute as** to your account
   - Set **Who has access** to "Anyone"
   - Click **Deploy**
   - Copy the generated URL (looks like: `https://script.google.com/macros/d/.../usercontent`)

5. **Get your Script ID:**
   - Extract the Script ID from the deployment URL (the long string between `/d/` and `/`)
   - Update `.env.local` in your React app with this Script ID

6. **Test the API:**
   - Open your deployment URL in a browser
   - You should see: `{"status":"API is running",...}`

#### Alternative: Using with existing Google Apps Script project
If you already have a Google Apps Script project:
- Add the `Code.gs` file to your project
- Deploy as web app following steps 4-6 above

## Form Flow

### Step 1: Base Information (Always Visible)
- Name
- Contact Number
- Gender (Male/Female)
- Service Provider (populates based on gender)
- First Visit? (Yes/No)
- Satisfaction Rating (1-5 stars)

### Step 2: Conditional Fields (Based on Satisfaction)

**If 4-5 Stars (Satisfied):**
- What did you like most?
- What can we improve?
→ Shows Google Review prompt

**If 3 Stars (Neutral):**
- What should we work on?
→ Standard thank you message

**If 1-2 Stars (Unsatisfied):**
- Share your concerns
→ Shows callback confirmation + "Share Additional Details" link

## Service Providers

### Male Service Providers
Fahim A, Faizan A, Hasnain A, Mohsin A, Murti A, Pradeep A, Rahat A, Rahul S, Raj K, Raja A, Raza A, Sohaib A, Umair A, Vinitt S, Yogesh A, Zishan A, Gauri S, Pooja Y, Sejal, Zoya A

### Female Service Providers
Anita, Bunu, Muskan, Nilisha, Soni, Tuba, Varsha, Ninsi

## Data Storage

Feedback is stored in a Google Sheet with the following columns:
- Timestamp
- Name
- Contact
- Gender
- Provider
- First Visit
- Satisfaction Score
- Liked Most
- Improvement
- Neutral Suggestions
- Unhappy Concerns

## Environment Variables

Create a `.env.local` file:
```
VITE_GAS_API_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
```

Replace `YOUR_SCRIPT_ID` with your actual Google Apps Script ID.

## Security Considerations

- CORS is enabled for all origins (can be restricted if needed)
- Data is stored securely in Google Sheets
- No sensitive data is exposed in client-side code
- Form validation prevents incomplete submissions

## Customization

### Update Branding
- Modify logo URLs in `FeedbackForm.jsx`
- Change brand names in various text strings
- Update color scheme in `tailwind.config.js`

### Update Service Providers
- Edit `MALE_PROVIDERS` and `FEMALE_PROVIDERS` arrays in `FeedbackForm.jsx`

### Update Success URLs
- Google Review links: Edit in `SuccessScreen.jsx`
- Complaint form link: Edit in `SuccessScreen.jsx`

## Troubleshooting

### CORS Errors
- Verify your Google Apps Script is deployed as "Web app"
- Check that "Who has access" is set to "Anyone"
- Ensure `.env.local` has the correct Script ID

### Data not appearing in Sheet
- Check the Apps Script logs: Apps Script > Executions
- Verify the sheet name is exactly "FeedbackData"
- Check browser console for submission errors

### Form not submitting
- Check `.env.local` is configured correctly
- Open browser DevTools > Network tab to see request details
- Check Google Apps Script execution logs

## Performance & Scalability

- React app is optimized for production with Vite
- Google Sheets can handle thousands of responses
- Response time typically < 2 seconds
- No rate limiting - suitable for high-traffic forms

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Google Apps Script logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

## License

This project is proprietary to the salon brand.
