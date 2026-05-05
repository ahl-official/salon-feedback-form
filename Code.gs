/**
 * Client Feedback Form - Google Apps Script Backend
 * Handles form submissions from the React frontend and stores data in Google Sheets
 */

// Main doPost handler - accepts JSON from the React app
function doPost(e) {
  try {
    // Parse the JSON payload from the request
    const payload = JSON.parse(e.postData.contents);

    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create the FeedbackData sheet
    let sheet = ss.getSheetByName('FeedbackData');
    if (!sheet) {
      sheet = ss.insertSheet('FeedbackData');
      createHeaders(sheet);
    }

    // Append the data to the sheet (matching column order in Google Sheet)
    // Logic: Different fields for different satisfaction levels
    // 4-5 Stars: Liked Most + Improvement Area
    // 3 Stars: Neutral Suggestions
    // 1-2 Stars: Concerns/Suggestions
    const newRow = [
      payload.timestamp,
      payload.provider,
      payload.name,
      payload.contact,
      payload.gender,
      payload.satisfactionScore,
      (payload.satisfactionScore >= 4) ? (payload.likedMost || '') : '',  // Column G: Liked Most (4-5 stars)
      (payload.satisfactionScore >= 4) ? (payload.improvement || '') : (payload.satisfactionScore === 3 ? (payload.neutralSuggestions || '') : ''),  // Column H: Improvement Area / Neutral Suggestions
      payload.firstVisit,  // Column I: First Visit (always)
      (payload.satisfactionScore <= 2) ? (payload.unhappyConcerns || '') : '',  // Column J: Concerns/Suggestions (1-2 stars)
    ];

    sheet.appendRow(newRow);

    // Return success response with proper CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
        timestamp: payload.timestamp,
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type');

  } catch (error) {
    // Log the error
    Logger.log('Error in doPost: ' + error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error processing feedback',
        error: error.toString(),
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
