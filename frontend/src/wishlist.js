/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { GetWishes, InsertWish } from './apis';

function Wishlist() {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState('initial');
  const [listOfWishes, setListOfWishes] = useState('default');
  const [wishcount, setWishCount] = useState(0);
  const [prevWish, setPrevWish] = useState();

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

  function getShowCount(list) {
    return list.filter((item) => item.show === true).length;
  }

  async function GetWishesList() {
    try {
      const apiresp = await GetWishes();
      apiresp.sort(dynamicSort('-source'));
      const goodlist = apiresp.map((item) => ({ ...item, isReadOnly: true, show: true }));

      setListOfWishes(goodlist);
      setLoading('false');
      setWishCount(getShowCount(goodlist));
    } catch (e) {
      console.log(`Error in Wishlist.GetWishesList: ${e.message}`);
    }
  }

  // let wishcount = 0;
  // only runs once because of []
  useEffect(() => {
    setLoading('true');
    GetWishesList();
  }, []);

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

  function replaceWishInList(list, wishToUse) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i]._id === wishToUse._id) {
        list.splice(i, 1, wishToUse);
      }
    }
    return [...list];
  }

  function ShowWishes({ currentList }) {
    // console.log("props is ", currentList);
    // const [prevList, setPrevList] = useState();
    // const { listOfWishes } = props;
    let prevList = [];
    // let prevList = (function () {
    //     if (prevList !== undefined && prevList.length > 0) {
    //         return [...prevList];
    //     }

    //     return [...listOfWishes];
    // }())

    // useEffect(() => {
    //     // setPrevList(listOfWishes.map((i) => (i)));
    //     prevList = listOfWishes.map((i) => (i));
    //     console.log("use effect prevlist", prevList);
    // }, []);

    function ShowEdit({ item }) {
      const handleEdit = () => {
        prevList = currentList.map((i) => ({ ...i, isReadOnly: true }));
        item.isReadOnly = false;

        setPrevWish({ ...item });
        console.log('prevWish edit', { ...item });
      };

      if (item.source === 'manual') {
        return (

          <span>
            <button className="typicalbutton righthand" type="button" onClick={() => handleEdit(item)}>
              Edit
            </button>
          </span>

        );
      }
      return null;
    }

    function Cancel(props) {
      const [prevList, prevItem, item] = props.props;

      const handleCancel = useCallback(() => {
        prevItem.isReadOnly = true;
        setListOfWishes(replaceWishInList(currentList, { ...prevItem }));
      });

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
    }

    function Submit({ item }) {
      const handleSubmit = useCallback(() => {
        insertWish(item);
        item.isReadOnly = true;
        setListOfWishes(currentList.map((i) => (i)));
      }, []);

      async function insertWish(item) {
        try {
          await InsertWish(item);
        } catch (e) {
          console.log(`Error in wishlist.insertWish: ${e.message}`);
        }
      }

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
    }

    const handleCategoryChange = (e, item) => {
      item.category = e.target.value;
      setListOfWishes(currentList.map((i) => (i)));
    };
    // TODO fix this so it doesnt stop after 1 character
    const handleChange = (e, item) => {
      const { name, value } = e.target;
      item[name] = value;
      console.log('list of wishes', currentList);
      setListOfWishes(currentList.map((i) => (i)));
      // special cases
      // if (setter === setVideo) {
      //     setInvalidVideo(!ReactPlayer.canPlay(value))
      // }
    };

    return (
      <div>
        {
          currentList == null ? null
            : currentList.map((item) => (
              <div key={item._id}>
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
                            <ShowEdit item={item} />
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
                            <a className="wishatt" href="" onClick={(e) => goToLink(item.link)}>{item.link}</a>
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
                                <Submit item={item} />
                                <Cancel props={[prevList, prevWish, item]} />
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
            ))
        }
      </div>
    );
  }

  function HandleFilterChange(e) {
    const wishcheck = listOfWishes.slice();
    const { value } = e.target;

    for (let i = wishcheck.length - 1; i >= 0; i -= 1) {
      wishcheck[i].isReadOnly = true;
      wishcheck[i].show = true;
      if (value !== 'all' && wishcheck[i].category !== value) {
        wishcheck[i].show = false;
      }
    }
    setFilter(value);
    setWishCount(getShowCount(wishcheck));
    setListOfWishes(wishcheck);
  }

  if (loading === 'initial') {
    return <h2 className="content">Initializing...</h2>;
  }

  if (loading === 'true') {
    return <h2 className="content">Loading...</h2>;
  }

  return (
    <div className="contentwrapper">
      <div className="contentBanner">
        <h1 className="wishTitle">
          Wishes:
          {' '}
          {wishcount}
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
      <div className="content">
        <ShowWishes currentList={listOfWishes} />
      </div>
    </div>
  );
}

export default Wishlist;
