import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { GetWishes, InsertWish } from './apis'

function Wishlist() {

    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState("initial");
    const [listOfWishes, setListOfWishes] = useState("default");
    const [wishcount, setWishCount] = useState(0);
    const [prevWish, setPrevWish] = useState();

    // let wishcount = 0;
    // only runs once because of []
    useEffect(() => {
        setLoading('true');
        GetWishesList();
    }, []);

    const goToLink = async link => {
        let taburl = ""
        try {
            taburl = await getUrl(link);
            return openInTab(taburl);
        }
        catch (e) {
            console.log("Error getting url from link: " + link + " " + e.message);
            return window.location.href;

        }
    };

    const openInTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null
    };

    async function getUrl(link) {
        let toflask = '/go_outside_flask/' + link;
        let tempurl = await axios.get(toflask);
        let newurl = tempurl.data;
        return newurl;
    };

    function getShowCount(list) {
        return list.filter((item) => item.show === true).length;
    }

    function replaceWishInList(list, wishToUse) {
        for (let i = 0; i < list.length; i++) {
            if (list[i]._id === wishToUse._id) {
                list.splice(i, 1, wishToUse);
            }
        }
        return [...list];
    }

    const ShowWishes = () => {

        // const [prevList, setPrevList] = useState();
        let prevList = []
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


        const ShowEdit = ({ item }) => {


            const handleEdit = () => {

                prevList = listOfWishes.map((i) => ({ ...i, isReadOnly: true }));
                item.isReadOnly = false;

                setPrevWish({ ...item });
                console.log("prevWish edit", { ...item });

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
        };

        const Cancel = (props) => {
            var [prevList, prevItem, item] = props.props;

            const handleCancel = useCallback(() => {

                prevItem.isReadOnly = true;
                setListOfWishes(replaceWishInList(listOfWishes, { ...prevItem }));
            })

            if (!item.isReadOnly) {
                return (

                    <span >
                        <button className="typicalbutton" type="button" onClick={(e) => handleCancel(e, prevItem, item)}>
                            Cancel
                        </button>
                    </span>

                );
            }
            return null;
        }

        const Submit = ({ item }) => {

            const handleSubmit = useCallback(() => {
                insertWish(item);
                item.isReadOnly = true;
                setListOfWishes(listOfWishes.map((i) => (i)));
            }, [])

            async function insertWish(item) {
                try {
                    await InsertWish(item);
                }
                catch (e) {
                    console.log("Error in wishlist.insertWish: " + e.message);
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
        };

        const handleCategoryChange = (e, item) => {
            item.category = e.target.value;
            setListOfWishes(listOfWishes.map((i) => (i)));

        };
        // TODO fix this so it doesnt stop after 1 character
        const handleChange = (e, item) => {
            const { name, value } = e.target;
            item[name] = value;
            console.log("list of wishes", listOfWishes);
            setListOfWishes(listOfWishes.map((i) => (i)));
            //special cases
            // if (setter === setVideo) {
            //     setInvalidVideo(!ReactPlayer.canPlay(value))
            // }

        }

        return (
            < div >
                {
                    listOfWishes == null ? null :
                        listOfWishes.map((item) => (
                            <div key={item._id}>
                                {item.show ? (
                                    <div className='wish' >
                                        <div className="wishatt">
                                            {
                                                item.isReadOnly ? (
                                                    <div>
                                                        <span className="wishatt capital" >Category: {item.category}</span>
                                                        <ShowEdit item={item} />
                                                        <div className="wishatt">Item Name: {item.name}</div>
                                                        <div className="wishatt">Description: {item.description}</div>
                                                        <div className="wishatt">Cost: {item.cost}</div>
                                                        <span>Link: </span><a className="wishatt" href="" onClick={(e) => goToLink(item.link)}>{item.link}</a>
                                                        <div className="wishatt">Quantity: {item.quantity}</div>
                                                    </div>
                                                ) :
                                                    (<span>
                                                        <label>
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
                                                            <div><label>
                                                                Item Name:
                                                            </label><input className="wishatt" name="name" placeholder="Name" onChange={(e) => handleChange(e, item)} value={item.name} /></div>
                                                            <div><label>
                                                                Description:
                                                            </label><input className="wishatt" name="description" placeholder="Name" onChange={(e) => handleChange(e, item)} value={item.description} /></div>
                                                            <div><label>
                                                                Cost:
                                                            </label><input className="wishatt" name="cost" placeholder="Cost" onChange={(e) => handleChange(e, item)} value={item.cost} /></div>
                                                            <div><label>
                                                                Link:
                                                            </label><input className="wishatt" name="link" placeholder="Link" onChange={(e) => handleChange(e, item)} value={item.link} /></div>
                                                            <div><label>
                                                                Quantity:
                                                            </label><input className="wishatt" name="quantity" placeholder="Quantity" onChange={(e) => handleChange(e, item)} value={item.quantity} /></div>
                                                            <div className="wishatt">Wishlist: {item.wishlist}</div>
                                                        </div>
                                                    </span>)
                                            }

                                        </div>

                                    </div>
                                ) : null}
                            </div>
                        )
                        )
                }
            </div >
        );
    };

    function HandleFilterChange(e) {
        const wishcheck = listOfWishes.slice();
        const value = e.target.value;

        for (var i = wishcheck.length - 1; i >= 0; i--) {
            wishcheck[i].isReadOnly = true;
            wishcheck[i].show = true;
            if (value != "all" && wishcheck[i].category !== value) {
                wishcheck[i].show = false;
            }
        }
        setFilter(value);
        setWishCount(getShowCount(wishcheck));
        setListOfWishes(wishcheck);

    };

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {

            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    async function GetWishesList() {
        try {
            let apiresp = await GetWishes();
            apiresp.sort(dynamicSort("-source"));
            var goodlist = apiresp.map(function (item) {
                return { ...item, isReadOnly: true, show: true };
            })

            setListOfWishes(goodlist);
            setLoading('false');
            setWishCount(getShowCount(goodlist));
        }
        catch (e) {
            console.log("Error in Wishlist.GetWishesList: " + e.message);
        }
    };

    if (loading === 'initial') {
        return <h2 className="content">Initializing...</h2>;
    }

    if (loading === 'true') {
        return <h2 className="content">Loading...</h2>;
    }

    return (
        <div className="contentwrapper">
            <div className="contentBanner">
                <h1 className="wishTitle">Wishes: {wishcount}</h1>
                <label>
                    <p className="bannerFilter">Category</p>
                    <select name="category" value={filter} onChange={(e) => HandleFilterChange(e)}>
                        <option value="all" >All</option>
                        <option value="default">Default</option>
                        <option value="camping">Camping</option>
                        <option value="hendrix">Hendrix</option>
                        <option value="decor">Decor</option>
                    </select>
                </label>
            </div>
            <div className="content">
                <ShowWishes wishlist={listOfWishes} />
            </div>
        </div>
    );
};

export default Wishlist;