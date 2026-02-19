# financial-webapp
A web application for tracking personal finances on the fly.

## Features

💰 **Financial Management Tool**
- Track income and expenses
- Categorize transactions (Salary, Freelance, Food, Transportation, etc.)
- View current balance, total income, and total expenses
- Filter transactions by type (All/Income/Expense)
- Delete individual transactions or clear all
- Persistent storage using localStorage
- Beautiful, responsive UI that works on desktop and mobile
- Real-time balance calculations

## How to Use

### Quick Start
1. Clone this repository
2. Open `index.html` in a web browser, or serve it using any web server
3. Start tracking your finances!

### Using a Local Server
```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Adding Transactions
1. Fill in the transaction details:
   - **Description**: Name of the transaction (e.g., "Monthly Salary", "Grocery Shopping")
   - **Amount**: Transaction amount in dollars
   - **Type**: Select Income or Expense
   - **Category**: Choose from pre-defined categories
   - **Date**: Transaction date
2. Click "Add Transaction" to save

### Managing Transactions
- **Filter**: Use the dropdown to show all transactions, income only, or expenses only
- **Delete**: Click the "Delete" button on any transaction to remove it
- **Clear All**: Remove all transactions at once (with confirmation)

### Data Persistence
All your transactions are automatically saved to your browser's localStorage, so your data persists between sessions. Data is stored locally on your device and is not sent to any server.

## Technical Details

### Built With
- Pure HTML5
- CSS3 with modern features (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- No frameworks or build tools required

### Browser Compatibility
Works in all modern browsers that support:
- LocalStorage API
- ES6 JavaScript features
- CSS Grid and Flexbox

### Security Features
- Event delegation to prevent XSS vulnerabilities
- Input sanitization using DOM methods
- No external dependencies
- Client-side only (no data transmission)

## Screenshots

![Financial Manager](https://github.com/user-attachments/assets/7ebf92ec-b789-4593-88d7-576f2cdead79)
*Initial state with clean interface*

![With Transactions](https://github.com/user-attachments/assets/9794d754-6bc0-4924-b561-4b8ff3e9aa27)
*Managing multiple transactions*

## License

Open source - feel free to use and modify as needed.
