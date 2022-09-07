/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GetDistinctWishlists } from './apis';


function dynamicSort(property, sortOrderWord = 'asc') {
  let sortOrder;
  if (sortOrderWord === 'asc') {
    sortOrder = 1;
  }
  else {
    sortOrder = -1;
  }

  return (a, b) => {
    let result = 0;
    if ((a[property] < b[property])) {
      result = -1;
    } else if (a[property] > b[property]) {
      result = 1;
    }
    return result * sortOrder;
  };
}

let wishlistOptions = [];

async function RetrieveWishlistOptions() {
  try {
    const apiresp = await GetDistinctWishlists();
    const options = apiresp.sort();
    wishlistOptions = (options.map(function (option) {
      return (
        <option key={option} value={option}>{option}</option>
      )
    }
    ));


  } catch (e) {
    console.log(`Error in Wishlist.GetWishlistOptions: ${e.message}`);
  }
}
const GetWishlistOptions = () => {
  RetrieveWishlistOptions();
}

GetWishlistOptions();


// Main component, acts a wrapper for the entire screen content
const ManageWishlist = () => {
  const [listOfWishes, setListOfWishes] = useState('default');
  // Passed down to update the main list state
  function updateListOfWishes(list) {
    setListOfWishes([...list]);
  }

  // Only once,
  useEffect(() => {
  }, []);

  // Return header and content, pass down function for deep state update
  return (
    <div className="contentwrapper">
      <WishlistHeader fullList={listOfWishes} updateListOfWishes={updateListOfWishes} />
      <WishListTable fullList={listOfWishes} updateListOfWishes={updateListOfWishes} />
    </div>
  );
}

// Header component
const WishlistHeader = (props) => {

  let list = props.fullList;

  function AddWishlist() {

  }


  // Return header component content
  return (
    <div className="contentBanner">
      <h1 className="wishTitle bannerItem5">
        Wishlists:
      </h1>
      <button className="typicalbutton bannerItem5" type="button" onClick={() => AddWishlist()}>
        Add
      </button>
    </div>
  );
}

// Component to show list of items
function WishListTable(props) {

  return (
    <div className="content">
    </div>
  );
};

// Individual row render for each item
const WishListRow = (props) => {
  let item = props.item;
  let prevItem = useRef(item);

  // Store unedited item in case of cancel, mark not read only
  const handleEdit = () => {
    let { item, currentList, updateListOfWishes } = props;
    prevItem.current = { ...item };
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...i, isReadOnly: false }
      }

      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  // Send item to DB
  async function insertWish(item) {
    try {
      await InsertWish(item);
    } catch (e) {
      console.log(`Error in manageWishlist.insertWish: ${e.message}`);
    }
  };


  // Send current item info to DB and mark read only
  const handleSubmit = () => {
    let { item, currentList, updateListOfWishes } = props;
    insertWish(item);
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...i, isReadOnly: true };
      }
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  // Return content for submit button
  function Submit(item) {
    if (!item.isReadOnly) {
      return (
        <span>
          <button className="typicalbutton" type="button" onClick={() => handleSubmit(item)}>
            Submit
          </button>
        </span>

      );
    }
    return null;
  };

  // Return content for edit button
  function ShowEdit(item) {
    if (item.source === 'manual' || item.source === 'auto') {
      return (
        <span  >
          <button className="typicalbutton righthand" type="button" onClick={() => handleEdit(item, props.currentList)}>
            Edit
          </button>
        </span>
      );
    }
    return null;
  };


  // Revert to unedited item and mark read only
  const handleCancel = () => {
    let { item, currentList, updateListOfWishes } = props;
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...prevItem.current, isReadOnly: true }
      }
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  // Return content for cancel button
  function Cancel(item) {

    if (!item.isReadOnly) {
      return (
        <span>
          <button className="typicalbutton" type="button" onClick={(e) => handleCancel(e, prevItem, item)}>
            Cancel
          </button>
        </span>
      );
    }
    return null;
  };

  // Update item when fields edited
  const handleChange = (e) => {
    let { item, currentList, updateListOfWishes } = props;
    const { name, value } = e.target;
    item[name] = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  // Update item for category change
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    let { item, currentList, updateListOfWishes } = props;
    item.category = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  // Update item for wishlist change
  const handleWishlistChange = (e) => {
    const { value } = e.target;
    let { item, currentList, updateListOfWishes } = props;
    item.wishlist = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  // Open url in new tab  
  const openInTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  // Get the url from backend
  async function getUrl(link) {
    const toflask = `/go_outside_flask/${link}`;
    const tempurl = await axios.get(toflask);
    const newurl = tempurl.data;
    return newurl;
  }

  // Get the url from backend and go to it in new tab
  const goToLink = async (link) => {
    let taburl = '';
    try {
      taburl = await getUrl(link);
      return openInTab(taburl);
    } catch (e) {
      console.log(`Error getting url from link: ${link} ${e.message}`);
      return window.location.href;
    }
  };


  // Row content, if read only show just fields, if not read only then show different buttons and editable fields
  return (
    <div >

    </div>
  )
}

export default ManageWishlist;
