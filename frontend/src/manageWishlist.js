/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GetWishlists, InsertWishlist } from './apis';


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

function dateFormat(date) {
  console.log("d before is ", date);

  const d = new Date(date);
  console.log("d is ", d);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  let suffix = 'AM';
  let hour = d.getUTCHours().toString();

  if (hour > 12) {
    hour = String(hour - 12);
    suffix = 'PM';
  }

  let mins = d.getUTCMinutes().toString();

  let sec = d.getUTCSeconds().toString();

  if (hour.length === 1) {
    hour = '0' + hour;
  }

  if (mins.length === 1) {
    mins = '0' + mins;
  }

  if (sec.length === 1) {
    sec = '0' + sec;
  }
  const monthString = month >= 10 ? month : `0${month}`;
  const dayString = day >= 10 ? day : `0${day}`;
  return `${monthString}/${dayString}/${d.getFullYear()} at ${hour}:${mins}${sec ? `:${sec}` : ''} ${suffix}`;
}

// let wishlistOptions = [];



// GetWishlistOptions();


// Main component, acts a wrapper for the entire screen content
const ManageWishlist = () => {
  const [wishlists, setWishlists] = useState();
  // Passed down to update the main list state
  function updateWishlists(list) {
    setWishlists([...list]);
  }


  async function RetrieveWishlistOptions() {
    try {
      const apiresp = await GetWishlists();
      let options = apiresp.sort();
      options = options.map((item) => ({ ...item, isReadOnly: true }));

      console.log("options is ", options)
      setWishlists(options)


    } catch (e) {
      console.log(`Error in Wishlist.GetWishlistOptions: ${e.message}`);
    }
  }

  // function GetWishlistOptions() {
  //   return RetrieveWishlistOptions();
  // }

  // Only once,
  useEffect(() => {
    RetrieveWishlistOptions()
  }, []);

  console.log("wishlists ", wishlists)
  // Return header and content, pass down function for deep state update
  return (
    <div className="contentwrapper">
      <WishlistHeader fullList={wishlists} updateWishlists={updateWishlists} />
      <WishListTable fullList={wishlists} updateWishlists={updateWishlists} />
    </div>
  );
}

// Header component
const WishlistHeader = (props) => {

  let { fullList, updateWishlists } = props;

  function AddWishlist() {
    console.log("fullList is ", fullList)

    fullList.unshift({ "name": "", "link": "", "baseLink": "", "_id": "", "added_date": "" })

    updateWishlists(fullList)
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

  console.log(props)

  const rows = [];
  let { fullList, updateWishlists } = props;
  if (typeof fullList === "undefined") {
    console.log('currentList is null');
  } else {
    fullList.forEach(function (item) {
      rows.push(
        <div key={item._id} >
          <WishListRow item={item} currentList={fullList} updateWishlists={updateWishlists} />
        </div>)
    })
  }

  return (
    <div className="content">
      {rows}
    </div>
  );
};

// Individual row render for each item
const WishListRow = (props) => {
  let item = props.item;
  let prevItem = useRef(item);
  // console.log("props is ", props)
  // Store unedited item in case of cancel, mark not read only
  const handleEdit = () => {
    let { item, currentList, updateWishlists } = props;
    prevItem.current = { ...item };
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...i, isReadOnly: false }
      }

      return { ...i };
    });
    updateWishlists(newlist);
  };

  // Send item to DB
  async function insertWishlist(item) {
    try {
      await InsertWishlist(item);
    } catch (e) {
      console.log(`Error in manageWishlist.insertWishlist: ${e.message}`);
    }
  };


  // Send current item info to DB and mark read only
  const handleSubmit = () => {
    let { item, currentList, updateWishlists } = props;
    if (!item['added_date']) {
      let newdate = new Date()
      newdate = newdate.getTime() - newdate.getTimezoneOffset() * 60000
      item['added_date'] = newdate;
      console.log("Submit date is ", item['added_date'])
    }
    console.log("time offset is ", new Date().getTimezoneOffset());
    insertWishlist(item);
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...i, isReadOnly: true };
      }
      return { ...i };
    });
    updateWishlists(newlist);
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
    return (
      <span  >
        <button className="typicalbutton righthand" type="button" onClick={() => handleEdit(item, props.currentList)}>
          Edit
        </button>
      </span>
    );

  };


  const handleDelete = () => {
    let { item, currentList, updateWishlists } = props;
    prevItem.current = { ...item };
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...i, isReadOnly: false }
      }

      return { ...i };
    });
    updateWishlists(newlist);
  };

  function ShowDelete(item) {
    return (
      <span  >
        <button className="typicalbutton righthand" type="button" onClick={() => handleDelete(item, props.currentList)}>
          Delete
        </button>
      </span>
    );

  };

  // Revert to unedited item and mark read only
  const handleCancel = () => {
    let { item, currentList, updateWishlists } = props;
    const newlist = currentList.map(i => {
      if (i._id === item._id) {
        return { ...prevItem.current, isReadOnly: true }
      }
      return { ...i };
    });
    updateWishlists(newlist);
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
    let { item, currentList, updateWishlists } = props;
    const { name, value } = e.target;
    item[name] = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateWishlists(newlist);
  };

  // Update item for category change
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    let { item, currentList, updateWishlists } = props;
    item.category = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateWishlists(newlist);
  };

  // Update item for wishlist change
  const handleWishlistChange = (e) => {
    const { value } = e.target;
    let { item, currentList, updateWishlists } = props;
    item.wishlist = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateWishlists(newlist);
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
    <div className="wish" >
      {!item.isReadOnly ? (
        <div>
          <div className="wishatt capital">
            <div>
              <label htmlFor="name">
                Wishlist Name:
              </label>
              <input className="wishatt" name="name" placeholder="name" onChange={(e) => handleChange(e, item)} value={item.name} />
              <span className="righthandSection">
                {Submit(item)}
                {Cancel(item)}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="description">
              Link:
            </label>
            <input className="wishatt" name="link" placeholder="link" onChange={(e) => handleChange(e, item)} value={item.description} />
          </div>
        </div>
      ) : (<div>
        <span className="wishatt capital">
          Wishlist Name:
          <span className="emphasize">{item.name}</span>
        </span>
        <div>
          {ShowEdit(item)}
          {ShowDelete(item)}
        </div>
        <div className="wishatt">
          Link:
          <a className="" href="#" onClick={(e) => goToLink(item.link)}>{item.link}</a>
        </div>
        <span className="wishatt">
          Added Date:
          <span className="emphasize">{dateFormat(item.added_date)}</span>
        </span>
      </div>
      )}

    </div>

  )
}

export default ManageWishlist;
