import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESSFUL',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.inProgress,
    activeSortOptionId: sortbyOptions[0].optionId,
    searchInputValue: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  changeSortby = activeSortOptionId => {
    this.setState({activeSortOptionId}, this.getProducts)
  }

  onSearchInput = eventValue => {
    this.setState({searchInputValue: eventValue})
  }

  onClickEnter = () => {
    this.getProducts()
  }

  changeCategory = activeCategoryId => {
    this.setState({activeCategoryId}, this.getProducts)
  }

  changeRating = activeRatingId => {
    this.setState({activeRatingId}, this.getProducts)
  }

  clearFilter = () => {
    this.setState(
      {
        searchInputValue: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {
      activeSortOptionId,
      activeCategoryId,
      searchInputValue,
      activeRatingId,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeSortOptionId}&category=${activeCategoryId}&title_search=${searchInputValue}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  zeroProductView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products-image"
      />
      <h1 className="no-products-heading">No Products Found</h1>
      <p className="no-products-paragraph">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  nonZeroProductView = () => {
    const {productsList, activeSortOptionId} = this.state

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeSortOptionId={activeSortOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductsList = () => {
    const {productsList} = this.state

    return (
      <>
        {productsList.length === 0
          ? this.zeroProductView()
          : this.nonZeroProductView()}
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="no-products-image"
      />
      <h1 className="no-products-heading">Oops! Something Went Wrong</h1>
      <p className="no-products-paragraph">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderApproapriateView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderProductsList()
    }
  }

  render() {
    const {activeCategoryId, activeRatingId} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onSearchInput={this.onSearchInput}
          onClickEnter={this.onClickEnter}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilter={this.clearFilter}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
        />
        {this.renderApproapriateView()}
      </div>
    )
  }
}

export default AllProductsSection
