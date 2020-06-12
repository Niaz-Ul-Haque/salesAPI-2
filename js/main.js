let saleData = [];
let page = 1;
let perPage = 10;

const saleTableTemplate = _.template(`
    <% _.forEach(data, function(current){%>
        <tr data-id="<%- current._id %>">
         <td><%- current.customer.email %></td>
         <td><%- current.storeLocation %></td>
         <td><%- current.items.length %></td>
         <td><%- moment(current.saleDate).format('LLLL') %></td>
        </tr>
    <% }) %>
`);

const saleModalBodyTemplate = _.template(`
        <h4>Customer</h4>
        <strong>email: </strong><%- data.customer.email %><br>
        <strong>age: </strong><%- data.customer.age %><br>
        <strong>satisfaction: </strong> <%- data.customer.satisfaction %> / 5 <br>
        <br>
        <h4>Items: $<%- data.total.toFixed(2) %></h4>
        <table class="table">
        <thead>
            <tr>
                <th>Product name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <% _.forEach(data.items,function(current){%>
                <tr>
                    <td> <%- current.name%> </td>
                    <td> <%- current.quantity%> </td>
                    <td> $<%- current.price%> </td>
                </tr>
            <% }) %>
        </tbody>
        </table>
`);

const loadSaleData = () => {
    fetch(`https://salesapi-niaz.herokuapp.com/api/sales/?page=${page}&perPage=${perPage}`)
        .then(response => response.json())
        .then(json => {
            saleData = json;
            $("#sale-table tbody").html(saleTableTemplate({ 'data': saleData }))
            $("#current-page").html(page);
        })                                                              
}

$(function () {
    loadSaleData();
    $("#sale-table").on("click", "tr", function (x) {
        let selectedID = $(this).attr("data-id");
        let clickedSale = _.find(saleData, function (sale) {
            return sale._id == selectedID;
        });
        
        let total = 0;
        for (let i = 0; i < clickedSale.items.length; i++) {
            total += clickedSale.items[i].price * clickedSale.items[i].quantity;
        }
        clickedSale.total = total;
        $("#sale-modal .modal-title").html("Sale: " + clickedSale._id);
        $("#sale-modal .modal-body").html(saleModalBodyTemplate({ data: clickedSale }))
        $("#sale-modal").modal({
            keyboard: false,
            backdrop: "static"
        })
    });
    $("#previous-page").on("click", function () {
        if (page > 1) {
            page--;
            loadSaleData();
        }
    });

    $("#next-page").on("click", function () {
        page++;
        loadSaleData();
    });
});