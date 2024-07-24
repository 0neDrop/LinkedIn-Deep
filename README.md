# LinkedIn-Deep UserScript

## Overview

This script is designed to retrieve additional information about a LinkedIn user, such as their address, phone number, and relatives, from an external source. The retrieved information is displayed behind the user's profile picture banner on LinkedIn.

## CORS and Cross-Origin Policy Workaround

### Problem
When attempting to fetch data from different origins, browsers enforce Cross-Origin Resource Sharing (CORS) policies to prevent security issues. Directly fetching data from an external site typically results in CORS errors.

### Solution
The solution involves identifying a LinkedIn page that does not enforce strict cross-origin policies and can be used to access the desired data indirectly. The "guest controls" page on LinkedIn (`https://www.linkedin.com/psettings/guest-controls/recent-history`) was found to be less protected against CORS and iframe restrictions compared to other LinkedIn pages, allowing the script to inject iframes for cross-origin data retrieval.

## Script Description

### Main Function
The script begins by setting up an interval that checks for the presence of a specific profile button on the LinkedIn page. This check runs every 100 milliseconds until the button is found. Once detected, the script stops the interval and processes the profile.

### Functions

1. **initCheckInterval**
   - This function sets up an interval that continuously checks for the presence of a specific profile button on the LinkedIn page. It runs every 100 milliseconds and stops once the button is found, triggering the `processProfile` function.

2. **processProfile**
   - This function processes the profile button once it is detected. It extracts the username from the button and formats it to create a URL for searching the user on an external site. It then sets a value to store the returned information and calls `initiateDataRetrieval`.

3. **initiateDataRetrieval**
   - This function initiates the data retrieval process by creating a hidden iframe that navigates to the LinkedIn guest controls page. This allows the script to bypass CORS restrictions. If the script detects that it is on the guest controls page, it injects another iframe that points to the external search site.

4. **displayResults**
   - This function is responsible for displaying the retrieved data on the LinkedIn profile page. It appends the retrieved information to the profile background section. If no data is found, it alerts the user that no deep results could be returned.

5. **Data Retrieval on External Site**
   - When the script is on the external search site, it fetches the desired data (such as address, phone number, and relatives) by making an HTTP request to the formatted URL. The script parses the returned HTML, extracts relevant information, and stores it for display.

### Display Results
The retrieved data is displayed on the LinkedIn profile page by appending it to the profile background section. If no data is found, an alert is shown to inform the user that no deep results could be returned.

### Error Handling
If the data retrieval process fails, the script logs an error and sets an empty array as the returned value.

## Conclusion
This script effectively bypasses CORS restrictions by leveraging LinkedIn's guest controls page, which is less protected against CORS and iframe restrictions compared to other LinkedIn pages. This allows cross-origin iframe injections to retrieve and display detailed profile data such as address, phone number, and relatives from an external source. The script is modular, easy to maintain, and demonstrates a clever workaround for typical cross-origin policy limitations.
