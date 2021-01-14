
const Inventory = [];

const Store={
    name:"random bookstore",
    list:Inventory,
    earnings:0
};

function Book(title,quantity,value){
    this.title=title;
    this.quantity=quantity;
    this.value=value;
}

function addBook(title,quantity,value){
    Inventory.push(new Book(title,quantity,value));
    console.log(Inventory);
}

function restockBook(title,quantity){
    for(i=0;i<Inventory.length;i++){
        if(Inventory[i].title===title){
            Inventory[i].quantity+=quantity;
            return;
        }
    }
    return "Restock failed, title not found on inventory";
    
}

function sellBook(title,quantity){
    let titlefound=false;
    for(i=0;i<Inventory.length;i++){
        if(Inventory[i].title===title){
            if(quantity<=Inventory[i].quantity){
                Inventory[i].quantity-=quantity;
                Store.earnings=Store.earnings+(quantity*Inventory[i].value);
                return "Successful Transaction";
            }else{
                if(Inventory[i].quantity===0){
                    return "Transaction failed, no stocks left";
                }else{
                    return "Transaction failed, only "+Inventory[i].quantity+" stocks left";
                }
            }
        }
    }
    return title+" out of stock";
}

function totalEarnings(){
    console.log("Store name: "+Store.name);
    console.log("Earnings: "+Store.earnings);
}

function listInventory(){
    console.log("Store name: "+Store.name);
    console.log("Inventory");
    Store.list.forEach((CurrElement)=>{
        console.log("Title: "+CurrElement.title+" | Qty: "+CurrElement.quantity+" | Value: "+CurrElement.value);
    });
}