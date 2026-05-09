/**
 * Client Feedback Form - Google Apps Script Backend
 * Handles form submissions from the React frontend and stores data in Google Sheets
 */

// Main doPost handler - accepts JSON from the React app
function doPost(e) {
  try {
    Logger.log('=== New Submission Received ===');
    Logger.log('Timestamp:', new Date().toISOString());
    
    // Parse the JSON payload from the request
    const payload = JSON.parse(e.postData.contents);
    Logger.log('Payload parsed successfully');

    // Basic input validation
    if (!payload.name || !payload.contact || !payload.gender || !payload.provider) {
      throw new Error('Missing required fields: name, contact, gender, provider');
    }

    if (!payload.timestamp || !payload.satisfactionScore) {
      throw new Error('Missing required fields: timestamp, satisfactionScore');
    }

    if (payload.satisfactionScore < 1 || payload.satisfactionScore > 5) {
      throw new Error('Invalid satisfaction score. Must be between 1-5');
    }

    Logger.log('Validation passed for:', payload.name);

    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create the FeedbackData sheet
    let sheet = ss.getSheetByName('FeedbackData');
    if (!sheet) {
      sheet = ss.insertSheet('FeedbackData');
      createHeaders(sheet);
      Logger.log('Created new FeedbackData sheet');
    }

    // Prepare data based on satisfaction level for clearer logic
    let likedMost = ''
    let improvementArea = ''
    let neutralSuggestions = ''
    let concerns = ''

    if (payload.satisfactionScore >= 4) {
      // 4-5 stars: Liked Most + Improvement Area
      likedMost = payload.likedMost || ''
      improvementArea = payload.improvement || ''
    } else if (payload.satisfactionScore === 3) {
      // 3 stars: Neutral Suggestions
      neutralSuggestions = payload.neutralSuggestions || ''
    } else if (payload.satisfactionScore <= 2) {
      // 1-2 stars: Concerns/Suggestions
      concerns = payload.unhappyConcerns || ''
    }

    // Create the row data array
    const newRow = [
      payload.timestamp,           // Column A: Timestamp
      payload.provider,            // Column B: Service Provider
      payload.name,                // Column C: Client Name
      payload.contact,             // Column D: Contact No
      payload.gender,              // Column E: Gender
      payload.satisfactionScore,   // Column F: Satisfaction (1-5)
      likedMost,                   // Column G: Liked Most (4-5 stars only)
      improvementArea || neutralSuggestions,  // Column H: Improvement Area / Neutral Suggestions
      payload.firstVisit,          // Column I: First Visit
      concerns,                    // Column J: Concerns/Suggestions (1-2 stars only)
    ];

    sheet.appendRow(newRow);
    Logger.log('✅ Data appended successfully');
    Logger.log('Total rows in sheet:', sheet.getLastRow());

    // Return success response with proper CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
        timestamp: payload.timestamp,
        rowNumber: sheet.getLastRow(),
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type');

  } catch (error) {
    // Log the error with details
    Logger.log('❌ Error in doPost:');
    Logger.log('Error message:', error.toString());
    Logger.log('Error line:', error.lineNumber);
    Logger.log('Stack trace:', error.stack);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error processing feedback',
        error: error.toString(),
        timestamp: new Date().toISOString(),
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Simple doGet handler for testing if the API is deployed
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'API is running',
      message: 'Salon Feedback Form API - Ready to receive submissions',
      timestamp: new Date().toISOString(),
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*');
}

/**
 * Create the header row for the FeedbackData sheet
 * @param {Sheet} sheet - The sheet to add headers to
 */
function createHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Service Provider',
    'Client Name',
    'Contact No',
    'Gender',
    'Satisfaction (1-5)',
    'Liked Most',
    'Improvement Area',
    'First Visit',
    'Concerns/Suggestions',
  ];

  sheet.appendRow(headers);

  // Format the header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0F172A');
  headerRange.setFontColor('#FFFFFF');

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Test function to verify the sheet structure and API
 * Call this from the Apps Script editor to verify everything is set up correctly
 */
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('FeedbackData');

  if (!sheet) {
    sheet = ss.insertSheet('FeedbackData');
    createHeaders(sheet);
    Logger.log('✅ Created FeedbackData sheet with headers');
  } else {
    Logger.log('✅ FeedbackData sheet already exists');
  }

  Logger.log('Total rows in sheet: ' + sheet.getLastRow());
  Logger.log('Sheet is ready for feedback submissions');
}

/**
 * Test function to add sample data (for local testing)
 * Call this from the Apps Script editor to add sample feedback
 */
function testAddSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('FeedbackData');

  if (!sheet) {
    sheet = ss.insertSheet('FeedbackData');
    createHeaders(sheet);
  }

  // Sample 5-star feedback (only Liked Most)
  const sample5Star = [
    new Date().toISOString(),
    'Fahim',
    'John Doe',
    '9876543210',
    'Male',
    5,
    'Service Quality',  // Liked Most
    '',  // Improvement Area (empty for 5 stars)
    'No',  // First Visit
    ''  // Concerns (empty for 5 stars)
  ];

  // Sample 3-star feedback (Liked Most + Improvement)
  const sample3Star = [
    new Date().toISOString(),
    'Murti',
    'Jane Smith',
    '9876543211',
    'Female',
    3,
    'Staff Behavior',  // Liked Most
    'Wait Time',  // Improvement Area
    'Yes',  // First Visit
    ''  // Concerns (empty for 3 stars)
  ];

  // Sample 1-star feedback (Liked Most + Concerns)
  const sample1Star = [
    new Date().toISOString(),
    'Pradeep',
    'Mike Johnson',
    '9876543212',
    'Male',
    1,
    'Cleanliness',  // Liked Most
    '',  // Improvement Area (empty for 1 star)
    'No',  // First Visit
    'Very long wait times and rude staff'  // Concerns
  ];

  sheet.appendRow(sample5Star);
  sheet.appendRow(sample3Star);
  sheet.appendRow(sample1Star);
  Logger.log('✅ Sample data added to FeedbackData sheet');
}
