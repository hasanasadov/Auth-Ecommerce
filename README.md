# CA_Product_Back

### MongoDB

#### Mongoose

##### Multer

##### checkValidation

##### PassPort JS

##### Node Mailer Transporter

It has Product and Box schemas

```ruby
Product = {
    name,
    price,
    image,  //upload w/multer
}

Box = {
    user,
    price,
    items : {
        product1 : {
            _id,
            quantity,
        }
        product2 : {
            _id,
            quantity,
        },
        ...
    }
}
```
