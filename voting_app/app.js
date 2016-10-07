const Product = React.createClass({
  handleUpVote: function () {
    this.props.onVote(this.props.id)
  },
  render: function () {
    return(
      <div className="item">
        <div className="image">
          <img src={ this.props.product_image_url } />
        </div>
        <div className="middle aligned content">
          <div className="header">
            <a onClick={ this.handleUpVote }>
              <i className="large caret up icon"></i>
            </a>
            { this.props.votes }
          </div>
          <div className="description">
            <a href={ this.props.url }>
              { this.props.title }
            </a>
          </div>
          <div className="extra">
            <span>Submited by:</span>
            <img className="ui avatar image" src={ this.props.submitter_avatar_url} />
          </div>
        </div>
      </div>
    );
  }
});

const ProductList = React.createClass({
  handleProductUpVote: function (productId) {
    console.log(productId + " was voted.")
  },

  render: function () {
    const products = Data.map((product) => {
      return(
        <Product
          key                  = { 'product-' + product.id }
          id                   = { product.id }
          title                = { product.title }
          description          = { product.description }
          url                  = { product.url }
          votes                = { product.votes }
          submitter_avatar_url = { product.submitter_avatar_url }
          product_image_url    = { product.product_image_url }
          onVote               = { this.handleProductUpVote }
        />
      )
    });

    return(
      <div className="ui items">
        { products }
      </div>
    )
  }
});

ReactDOM.render(
  <ProductList />,
  document.getElementById("content")
)
