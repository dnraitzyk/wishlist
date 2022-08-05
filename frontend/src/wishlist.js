/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GetWishes, InsertWish } from './apis';

const Wishlist = () => {
  const [loading, setLoading] = useState('initial');
  const [listOfWishes, setListOfWishes] = useState('default');

  function updateListOfWishes(list) {
    setListOfWishes([...list]);
  }

  function dynamicSort(property) {
    let sortOrder = 1;
    let newprop = '';
    if (property[0] === '-') {
      sortOrder = -1;
      newprop = property.substr(1);
    }
    return (a, b) => {
      let result = 0;
      if ((a[newprop] < b[newprop])) {
        result = -1;
      } else if (a[newprop] > b[newprop]) {
        result = 1;
      }
      return result * sortOrder;
    };
  }

  async function GetWishesList() {
    try {
      const apiresp = await GetWishes();
      apiresp.sort(dynamicSort('-source'));
      const goodlist = apiresp.map((item) => ({ ...item, isReadOnly: true, show: true }));

      setListOfWishes(goodlist);
      setLoading('false');
    } catch (e) {
      console.log(`Error in Wishlist.GetWishesList: ${e.message}`);
    }
  }

  useEffect(() => {
    setLoading('true');
    GetWishesList();
  }, []);

  if (loading === 'initial') {
    return <h2 className="content">Initializing...</h2>;
  }

  if (loading === 'true') {
    return <h2 className="content">Loading...</h2>;
  }

  return (
    <div className="contentwrapper">
      <WishlistHeader fullList={listOfWishes} updateListOfWishes={updateListOfWishes} />
      <WishTable fullList={listOfWishes} updateListOfWishes={updateListOfWishes} />
    </div>
  );
}

const WishlistHeader = (props) => {
  const [filter, setFilter] = useState('all');

  let list = props.fullList;

  function getShowCount(list) {
    return list.filter((item) => item.show === true).length;
  }

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

  return (
    <div className="contentBanner">
      <h1 className="wishTitle">
        Wishes:
        {' '}
        {getShowCount(list)}
      </h1>
      <label htmlFor="category">
        <p className="bannerFilter">Category</p>
        <select id="category" name="category" value={filter} onChange={(e) => HandleFilterChange(e)}>
          <option value="all">All</option>
          <option value="default">Default</option>
          <option value="camping">Camping</option>
          <option value="hendrix">Hendrix</option>
          <option value="decor">Decor</option>
        </select>
      </label>
    </div>
  );
}


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

const WishRow = (props) => {
  let item = props.item;
  let prevItem = useRef(item);

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

  async function insertWish(item) {
    try {
      await InsertWish(item);
    } catch (e) {
      console.log(`Error in wishlist.insertWish: ${e.message}`);
    }
  };

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

  function ShowEdit(item) {
    if (item.source === 'manual') {
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

  const handleChange = (e) => {
    let { item, currentList, updateListOfWishes } = props;
    const { name, value } = e.target;
    item[name] = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    let { item, currentList, updateListOfWishes } = props;
    item.category = value;
    const newlist = currentList.map(i => {
      return { ...i };
    });
    updateListOfWishes(newlist);
  };

  const openInTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  async function getUrl(link) {
    const toflask = `/go_outside_flask/${link}`;
    const tempurl = await axios.get(toflask);
    const newurl = tempurl.data;
    return newurl;
  }

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

  return (
    <div >
      {item.show ? (
        <div className="wish">
          <div className="wishatt">
            {
              item.isReadOnly ? (
                <div>
                  <span className="wishatt capital">
                    Category:
                    {item.category}
                  </span>
                  {ShowEdit(item)}
                  <div className="wishatt">
                    Item Name:
                    {item.name}
                  </div>
                  <div className="wishatt">
                    Description:
                    {item.description}
                  </div>
                  <div className="wishatt">
                    Cost:
                    {item.cost}
                  </div>
                  <span>Link: </span>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="wishatt" href="#" onClick={(e) => goToLink(item.link)}>{item.link}</a>
                  <div className="wishatt">
                    Quantity:
                    {item.quantity}
                  </div>
                </div>
              )
                : (
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
                        <input className="wishatt" name="name" placeholder="Name" onChange={(e) => handleChange(e, item)} value={item.name} />
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
                      <div className="wishatt">
                        Wishlist:
                        {item.wishlist}
                      </div>
                    </div>
                  </span>
                )
            }
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Wishlist;
