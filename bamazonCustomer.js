var mysql = require("mysql");
var Table = require('cli-table');
var inquirer= require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});


// database: bamazon
//table: products
//Columns: 
// item_id (int not null  auto_increment, primary Key)
// product_name (varchar (100) null)
//department_name (varchar (100) null)
//price (decimal (10,2) null)
//stuck_quantity (int null)

connection.connect (function(err,) {
  if(err) throw(err);
  displayAllProducts();

});

function displayAllProducts() {
connection.query("SELECT * FROM products", function(err, res) {
      if(err) {console.log (error)};
      var table = new Table({
        //declare the value categories
        head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
        //set widths to scale
        colWidths: [10, 30, 18, 10, 14]
    });
    //for each row of the loop
    for ( i = 0; i < res.length; i++) {
        //push data to table
        table.push(
            [res[i].item_id, res[i].product_name,res[i].department_name, res[i].price, res[i].stuck_quantity ]);
    }
    //log the completed table to console
    console.log(table.toString());
    purchaseRequest();
  });

};

function purchaseRequest() {
  //get item ID and desired quantity from user. Pass to purchase from Database
  inquirer.prompt([

      {
          name: "ID",
          type: "input",
          message: "What is the ID number of the item  would you like to purchase?"
      }, {
          name: 'quantity',
          type: 'input',
          message: "How many units would you like to buy?"
      },

  ]).then(function(answers) {
      //set captured input as variables, pass variables as parameters.
      var itemID = answers.ID;
      var quantity =answers.quantity;
      // var pay;
      // var idNotFound = true;

      // for (var i = 0; i < productIdArr.length; i++){
      //   if (productIdArr[i] == itemId){
      //       idNotFound = false;


      purchaseFromDatabase(itemID, quantity);

  });

}; //end inquireForPurchase

function purchaseFromDatabase(itemID, quantity) {
  //check quantity of desired purchase. Minus quantity of the itemID from database if possible. Else inform user "Quantity desired not in stock" 
  connection.query('SELECT * FROM products WHERE item_id = ' + itemID, function(error, res) {
      if (error) { console.log(error) };

      //if in stock
      if (quantity <= res[0].stuck_quantity) {
          //calculate cost
          var totalCost = res[0].price * quantity;
          //inform user
          console.log("Added to your order list!");
          console.log("Your total cost for " + quantity + " " + res[0].product_name + " is " + totalCost + ". Thank you for your Business!");
//           //update database, minus purchased quantity
          connection.query('UPDATE Products SET stuck_quantity = Stuck_quantity - ' + quantity + ' WHERE item_id = ' + itemID);
      } else {
          console.log("Our apologies, the item" + res[0].product_name + "is insufficient quantity on Stock. "); 
      };
      displayAllProducts();
      });

};


