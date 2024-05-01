import {IoIosSearch} from 'react-icons/io'

import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onSearchInput,
    activeCategoryId,
    activeRatingId,
    onClickEnter,
    changeCategory,
    changeRating,
    clearFilter,
  } = props

  const onChangeSearchInput = event => {
    onSearchInput(event.target.value)
  }

  const onKeyEnter = event => {
    if (event.key === 'Enter') {
      onClickEnter()
    }
  }

  const renderSearchBar = () => (
    <div className="search-container">
      <input
        type="search"
        placeholder="Search"
        onChange={onChangeSearchInput}
        onKeyDown={onKeyEnter}
        className="search-bar"
      />
      <IoIosSearch />
    </div>
  )

  const renderCategoryList = () => (
    <ul className="category-list">
      {categoryOptions.map(eachCategory => (
        <li className="category-item" key={eachCategory.categoryId}>
          <button
            type="button"
            className={`category-button ${
              activeCategoryId === eachCategory.categoryId
                ? 'selected-category'
                : ''
            }`}
            onClick={() => changeCategory(eachCategory.categoryId)}
          >
            <p className="category-name">{eachCategory.name}</p>
          </button>
        </li>
      ))}
    </ul>
  )

  const renderRatingList = () => (
    <ul className="rating-list">
      {ratingsList.map(eachRating => (
        <li className="rating-item" key={eachRating.ratingId}>
          <button
            type="button"
            className="rating-button"
            onClick={() => changeRating(eachRating.ratingId)}
          >
            <img
              src={eachRating.imageUrl}
              alt={`rating ${eachRating.ratingId}`}
              className="rating-image"
            />
            <p
              className={
                activeRatingId === eachRating.ratingId
                  ? 'selected-rating'
                  : 'and-up-text'
              }
            >
              & up
            </p>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="filters-group-container">
      {renderSearchBar()}
      <h1 className="heading">Category</h1>
      {renderCategoryList()}
      <h1 className="heading">Rating</h1>
      {renderRatingList()}
      <button
        type="button"
        className="clear-filters-button"
        onClick={clearFilter}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
