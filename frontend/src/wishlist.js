/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GetAllWishes, InsertWish, GetDistinctWishlists, GetExternalWishes, DeleteWish } from './apis';
// import { utf8ToAnsi } from 'utf8-to-ansi';

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
        <option key={Math.random()} value={option._id}>{option.name}</option>
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

// Main component, acts a wrapper for the entire screen content
const Wishlist = () => {



  const [loading, setLoading] = useState('initial');
  const [listOfWishes, setListOfWishes] = useState('default');
  // Passed down to update the main list state
  function updateListOfWishes(list) {
    setListOfWishes([...list]);
  }

  // Sorting lists dynamically

  // Get all items from DB, this is main list
  async function GetWishes() {
    try {
      const apiresp = await GetAllWishes();
      apiresp.sort(dynamicSort('wishlist'));
      const goodlist = apiresp.map((item) => ({ ...item, isReadOnly: true, show: true }));

      setListOfWishes(goodlist);
      setLoading('false');
    } catch (e) {
      console.log(`Error in Wishlist.GetWishes: ${e.message}`);
    }
  }


  // Only once, get items and set loading state
  useEffect(() => {
    setLoading('true');
    GetWishes();
    GetWishlistOptions();

  }, []);

  if (loading === 'initial') {
    return <h2 className="content">Initializing...</h2>;
  }

  if (loading === 'true') {
    return <h2 className="content">Loading...</h2>;
  }

  // Return header and content, pass down function for deep state update
  return (
    <div className="contentwrapper">
      <WishlistHeader fullList={listOfWishes} updateListOfWishes={updateListOfWishes} />
      <WishTable fullList={listOfWishes} updateListOfWishes={updateListOfWishes} />
    </div>
  );
}

// Header component
const WishlistHeader = (props) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('wishlist');
  const [sortOrder, setSortOrder] = useState('desc');

  let list = props.fullList;

  // Get length of current filtered list
  function getShowCount(list) {
    return list.filter((item) => item.show === true).length;
  }

  // Update shown list items when filter changes
  const HandleFilterChange = (e) => {
    const { fullList, updateListOfWishes } = props;
    const { value } = e.target;

    for (let i = fullList.length - 1; i >= 0; i -= 1) {
      fullList[i].isReadOnly = true;
      fullList[i].show = true;
      if (value !== 'all' && fullList[i].category !== value) {
        fullList[i].show = false;
      }
    }

    setFilter(value);

    const newlist = fullList.map(i => {
      return { ...i };

    });

    updateListOfWishes(newlist);
  }

  const HandleSortChange = (e) => {
    const { fullList, updateListOfWishes } = props;
    let { value } = e.target;

    setSortBy(value);

    fullList.sort(dynamicSort(value, sortOrder));
    const newlist = fullList.map(i => {
      return { ...i };

    });
    updateListOfWishes(newlist);
  }

  const HandleSortOrderChange = (sortOrder, sortBy) => {

    const { fullList, updateListOfWishes } = props;
    flipSortOrder(sortOrder);
    fullList.sort(dynamicSort(sortBy, sortOrder));
    const newlist = fullList.map(i => {
      return { ...i };

    });
    updateListOfWishes(newlist);
  }

  function flipSortOrder(sortOrder) {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  }

  function showSortArrow(sortOrder) {
    if (sortOrder === 'asc') {
      return "↑";
    } else {
      return "↓";
    }
  }

  const HandleRefreshWishes = () => {
    FetchExternalWishes();
  }

  async function FetchExternalWishes() {
    let { fullList, updateListOfWishes } = props;

    try {
      fullList = await GetExternalWishes();
      fullList.sort(dynamicSort('wishlist'));

      const goodlist = fullList.map((item) => ({ ...item, isReadOnly: true, show: true }));

      updateListOfWishes(goodlist);

    } catch (e) {
      console.log(`Error in Wishlist.HandleRefreshWishes: ${e.message}`);
    }


  }

  function HandleExport() {
    // FetchExternalWishes();
    let fullList = props.fullList.filter((i) =>
      i['show'] === true
    );
    fullList = fullList.map((i) => JSON.parse(JSON.stringify(i)))
    let csv = 'Name,Availability,Description,Category,Cost,Link,Quantity,Wishlist,Wishlist Link\n';
    fullList.forEach(function (obj) {
      Object.keys(obj).forEach(function (e) {
        if (typeof obj[e] === "string") {
          obj[e] = "\"" + obj[e] + "\""
          // .replace(",", "\",\"")
        }
      });
    })

    fullList = fullList.map(function (obj) {
      let innerarr = []
      // Object.keys(obj).forEach(function (e) {
      //   innerarr.push(String(obj[e]))
      // });
      innerarr.push(String(obj['name']) === "undefined" ? "" : String(obj['name']))
      innerarr.push(String(obj['availability']) === "undefined" ? "" : String(obj['availability']))
      innerarr.push(String(obj['description']) === "undefined" ? "" : String(obj['description']))
      innerarr.push(String(obj['category']) === "undefined" ? "" : String(obj['category']))
      innerarr.push(String(obj['cost']) === "undefined" ? "" : String(obj['cost']))
      innerarr.push(String(obj['link']) === "undefined" ? "" : String(obj['link']))
      innerarr.push(String(obj['quantity']) === "undefined" ? "" : String(obj['quantity']))
      innerarr.push(String(obj['wishlist']) === "undefined" ? "" : String(obj['wishlist']))
      innerarr.push(String(obj['wishlistLink']) === "undefined" ? "" : String(obj['wishlistLink']))
      return innerarr
    })

    fullList.forEach(function (row) {
      csv += row.join(',');
      csv += "\n";
    });

    var hiddenElement = document.createElement('a');

    // csv = encodeURI(csv);
    csv = csv.replaceAll('#', '%23')
    // csv = csv.replaceAll("'", '%E2%80%99')
    console.log("csv is ", JSON.stringify(csv))
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + csv;
    // csv = encodeURI(csv);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded  
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    // let csvencoded = await sendCSVContent(csv)
    // console.log("csvencoded ", csvencoded)
    // hiddenElement.href = 'data:text/csv;' + csv
    hiddenElement.download = 'WishlistExport' + date + time + '.csv';
    hiddenElement.click();


  }

  // async function sendCSVContent(csv) {
  //   try {
  //     // let resp = await SendCSVContent(csv).arrayBuffer()
  //     // const decoder = new TextDecoder('windows-1252');
  //     // const text = decoder.decode(resp);
  //     // console.log("text ", text)
  //     // return text
  //     return await SendCSVContent(csv)
  //   }
  //   catch (e) {
  //     console.log("Error in wishlist.sendCSVContent: " + e.message);
  //   }

  // }


  // Return header component content
  return (
    <div className="contentBanner">
      <h1 className="wishTitle bannerItem5">
        Wishes:
        {' '}
        {getShowCount(list)}
      </h1>
      <button className="typicalbutton bannerItem5" type="button" onClick={() => HandleRefreshWishes()}>
        Get Wishes
      </button>
      <button className="typicalbutton bannerItem5" type="button" onClick={() => HandleExport()}>
        Export
      </button>
      <label className="bannerItem5" htmlFor="category">
        <p>Category:</p>
        <select id="category" name="category" value={filter} onChange={(e) => HandleFilterChange(e)}>
          <option value="all">All</option>
          <option value="default">Default</option>
          <option value="camping">Camping</option>
          <option value="hendrix">Hendrix</option>
          <option value="decor">Decor</option>
        </select>
      </label>
      <label className="bannerItem5" htmlFor="sortBy">
        <p>Sort By:</p>
        <select id="sortBy" name="sortBy" value={sortBy} onChange={(e) => HandleSortChange(e)}>
          <option value="" disabled>Sort by...</option>
          <option value="link">Link</option>
          <option value="modified_date">Last Modified</option>
          <option value="name">Name</option>
          <option value="cost">Cost</option>
          <option value="category">Category</option>
          <option value="wishlist">Wishlist</option>
        </select>
      </label>
      <p className="fitText">Sort
      </p>
      <button className='sortButton bannerItem5' onClick={() => HandleSortOrderChange(sortOrder, sortBy)}>{showSortArrow(sortOrder)}</button>

    </div>
  );
}

// Component to show list of items
function WishTable(props) {
  const rows = [];
  let { fullList, updateListOfWishes } = props;
  if (fullList === null) {
    console.log('currentList is null');
  } else {
    fullList.forEach(function (item) {
      rows.push(
        <div key={item._id} >
          <WishRow item={item} currentList={fullList} updateListOfWishes={updateListOfWishes} />
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
const WishRow = (props) => {
  let item = props.item;
  let prevItem = useRef(item);



  // Send item to DB
  async function insertWish(item) {
    try {
      await InsertWish(item);
    } catch (e) {
      console.log(`Error in wishlist.insertWish: ${e.message}`);
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

  // Select item and update cost and num selected
  const handleSelect = () => {
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

  // Return content for select box
  function ShowSelect(item) {
    return (
      <span className='' >
        <input className="custom-control-input smallrightmargin" id='selectWish' type="checkbox" onClick={() => handleSelect(item, props.currentList)}>

        </input>
        <label className="custom-control-label" htmlFor="selectWish">Select</label>

        {/* <button className="typicalbutton" type="button" onClick={() => handleSelect(item, props.currentList)}>
          Select
        </button> */}
      </span>
    );

  };

  async function deleteWish(itemid) {
    try {
      await DeleteWish(itemid);
    } catch (e) {
      console.log(`Error in manageWishlist.deleteWish: ${e.message}`);
    }
  };

  const handleDelete = () => {
    let { item, currentList, updateListOfWishes } = props;
    prevItem.current = { ...item };
    const newlist = currentList.filter(i => {
      return i._id !== item._id
    }
    );
    deleteWish(item['_id']);
    updateListOfWishes(newlist);
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

  function dateFormat(date) {
    const d = new Date(date);

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

  // Row content, if read only show just fields, if not read only then show different buttons and editable fields
  return (
    <div >
      {item.show ? (
        <div className="wish flex">
          <span className='inlineblock smallrightmargin'>
            {ShowSelect()}
          </span>
          <span className="wishatt inlineblock">
            {
              item.isReadOnly ? (

                <div>
                  <span className="wishatt capital">
                    Category:
                    <span className="emphasize">{item.category}</span>
                  </span>
                  {ShowEdit(item)}
                  {item.source !== "auto" ? ShowDelete(item) : null}
                  <div className="wishatt capital">
                    Item Name:
                    {item.link ? (
                      <a className="" href="#" onClick={(e) => goToLink(item.link)}>{item.name}</a>
                    )
                      : (
                        <span className="">{item.name}</span>
                      )}
                  </div>
                  <div className="wishatt">
                    Description:
                    <span className="emphasize">{item.description}</span>
                  </div>
                  <div className="wishatt">
                    Cost:
                    <span className="emphasize">{item.cost}</span>
                  </div>
                  <div className="wishatt ">
                    Quantity:
                    <span className="emphasize">{item.quantity}</span>
                  </div>
                  <div className="wishatt capital ">
                    Wishlist:
                    <span className="emphasize">{item.wishlist}</span>
                  </div>
                </div>
              )
                :
                (
                  item.source === "auto" ? (
                    <div>
                      <label htmlFor="category">
                        Category:
                        <select className='custom-select custom-select-sm' name="category" onChange={(e) => handleCategoryChange(e, item)} value={item.category}>
                          <option value="default">Default</option>
                          <option value="camping">Camping</option>
                          <option value="hendrix">Hendrix</option>
                          <option value="decor">Decor</option>
                        </select>
                      </label>
                      <span className="righthandSection">
                        {Submit(item)}
                        {Cancel(item)}
                      </span>
                      <div className="wishatt capital">
                        Item Name:
                        <a className="" href="#" onClick={(e) => goToLink(item.link)}>{item.name}</a>
                      </div>
                      <div>
                        <label htmlFor="description">
                          Description:
                        </label>
                        <input className="wishatt" name="description" placeholder="Description" onChange={(e) => handleChange(e, item)} value={item.description} />
                      </div>
                      <div className="wishatt">
                        Cost:
                        <span className="emphasize">{item.cost}</span>
                      </div>
                      <div>
                        <label htmlFor="quantity">
                          Quantity:
                        </label>
                        <input className="wishatt" name="quantity" placeholder="Quantity" onChange={(e) => handleChange(e, item)} value={item.quantity} />
                      </div>
                      <div className="wishatt capital ">
                        Wishlist:
                        <span className="emphasize">{item.wishlist}</span>
                      </div>
                    </div>
                  ) :
                    (
                      <span>
                        <label htmlFor="category">
                          Category:
                          <select name="category" onChange={(e) => handleCategoryChange(e, item)} value={item.category}>
                            <option value="default">Default</option>
                            <option value="camping">Camping</option>
                            <option value="hendrix">Hendrix</option>
                            <option value="decor">Decor</option>
                          </select>
                        </label>
                        <span className="righthandSection">
                          {Submit(item)}
                          {Cancel(item)}
                        </span>
                        <div>
                          <div>
                            <label htmlFor="name">
                              Item Name:
                            </label>
                            <input className="wishatt capital" name="name" placeholder="Name" onChange={(e) => handleChange(e, item)} value={item.name} />
                          </div>
                          <div>
                            <label htmlFor="description">
                              Description:
                            </label>
                            <input className="wishatt" name="description" placeholder="Description" onChange={(e) => handleChange(e, item)} value={item.description} />
                          </div>
                          <div>
                            <label htmlFor="cost">
                              Cost:
                            </label>
                            <input className="wishatt" name="cost" placeholder="Cost" onChange={(e) => handleChange(e, item)} value={item.cost} />
                          </div>
                          <div>
                            <label htmlFor="link">
                              Link:
                            </label>
                            <input className="wishatt" name="link" placeholder="Link" onChange={(e) => handleChange(e, item)} value={item.link} />
                          </div>
                          <div>
                            <label htmlFor="quantity">
                              Quantity:
                            </label>
                            <input className="wishatt" name="quantity" placeholder="Quantity" onChange={(e) => handleChange(e, item)} value={item.quantity} />
                          </div>
                          <label htmlFor="wishlist">
                            Wishlist:
                            <select name="wishlist" onChange={(e) => handleWishlistChange(e, item)} value={item.wishlist}>
                              {wishlistOptions}
                            </select>
                          </label>
                        </div>
                      </span>
                    )
                )
            }
            <div className="wishatt">
              Owner:
              <span className='emphasize'>
                {item.owner}
              </span>
            </div>
            <div className="wishatt">
              Last Modified:
              <span className='emphasize'>
                {item.modified_date && dateFormat(item.modified_date)}
              </span>
            </div>
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default Wishlist;
