let express=require("express");
let app=express()
let fs=require("fs")
app.use(express.json());
const cors=require("cors");
let fname="test1";
let fname1="test2"

app.use(function(req,res,next){

    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,POST,PATCH,OPTIONS,PUT,DELETE,HEAD");
    res.header("Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type,Accept");
    next();
});
app.use(cors())
var port=process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let {shop,product,purchase}=require("./DataA.js")

app.get("/shops",function(req,res){
    res.send(shop);
})

app.post("/shopping",function(req,res){
    let body=req.body
    let maxid=shop.reduce((curr,acc)=>(curr.shopId>=acc?curr.shopId:acc),0)
    let newid=maxid.shopId+1;
    let newdata={shopId:newid,...body};
    shop.push(newdata);
    let str=JSON.stringify(newdata)
    fs.appendFile(fname1,str,function(err){
      if(err)
        console.log("not exit")
    })
    res.send(newdata)
})

app.get("/product",function(req,res){
    res.send(product);
})
app.post("/products",function(req,res){
    let body=req.body
    let maxid=product.reduce((curr,acc)=>(curr.productId>=acc?curr.productId:acc),0)
    let newid=maxid.productId+1;
    let newdata={productId:newid,...body};
    product.push(newdata);
    let str=JSON.stringify(newdata)
    fs.appendFile(fname,str,function(err){
      if(err)
        console.log("not exit")
    })
    res.send(newdata)
})

app.get("/product/edit/:editid",function(req,res){
    let id=req.params.editid;
    let data=product.filter((pr)=>pr.productId==id)
    res.send(data)
})
app.put("/products/:editid",function(req,res){
    let id=req.params.editid
    let body=req.body
    let data=product.findIndex((pr)=>pr.productId==id)
    product[data]=body
    res.send(product[data])
})
app.get("/purchase",function(req,res){
    let product=req.query.product;
    let shop=req.query.shop;
    let sort=req.query.sort
    let data=purchase;
    if(product)
    {
        let valuesArr=product.split(",");
        data=data.filter((pr) =>valuesArr.find((er)=>er==pr.productid))
    }
    if(shop)
    {
        data=data.filter((pr)=>pr.shopId==shop)
    }
    if(sort=="QtyAsc")
    {
       data.sort((s1,s2)=>
       {
        if(s1.quantity>s2.quantity)
          return 1;
        else if(s1.quantity<s2.quantity)
          return -1
       })
    }
    else if(sort=="QtyDesc")
    {
        data.sort((s1,s2)=>
       {
        if(s1.quantity>s2.quantity)
          return -1;
        else if(s1.quantity<s2.quantity)
          return 1
       })
    }
    else if(sort=="ValueAsc")
    {
        data.sort((s1,s2)=>
       {
        if(s1.price>s2.price)
          return 1;
        else if(s1.price<s2.price)
          return -1
       })
    }
    else if(sort=="ValueDesc")
    {
        data.sort((s1,s2)=>
       {
        if(s1.price>s2.price)
          return -1;
        else if(s1.price<s2.price)
          return 1
       })
    }
    res.send(data);
})
app.get("/purchase/shop/:shopid",function(req,res){
    let id=req.params.shopid;
    let data=purchase.filter((pr)=>pr.shopId==id)
    if(data)
      res.send(data)
    else
      res.status(404).send("not found")
})
app.get("/purchases/shops/:shopwid",function(req,res){
    let id=req.params.shopwid;
    let data=purchase.filter((pr)=>pr.shopId==id)
       data.sort((s1,s2)=>
       {
        if(s1.productid>s2.productid)
          return 1;
        else if(s1.productid<s2.productid)
          return -1
       })
    res.send(data)
})

app.get("/purchase/product/:productid",function(req,res){
    let id=req.params.productid;
    let data=purchase.filter((pr)=>pr.productid==id)
    res.send(data)
})
app.get("/purchases/products/:productwid",function(req,res){
    let id=req.params.productwid;
    let data=purchase.filter((pr)=>pr.productid==id)
       data.sort((s1,s2)=>
       {
        if(s1.shopId>s2.shopId)
          return 1;
        else if(s1.shopId<s2.shopId)
          return -1
       })
    res.send(data)
})