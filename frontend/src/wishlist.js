import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { GetWishes } from './apis'

function Wishlist() {

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [filter, setFilter] = useState("Default");
    const [wishes, setWishes] = useState([]);
    const [wishesToShow, setWishesToShow] = useState([]);
    const [loading, setLoading] = useState("initial");
    const [wishlist, setWishlist] = useState("default");

    // only runs once because of []
    useEffect(() => {
        setLoading('true');
        GetWishesList();
    }, []);

    async function goToLink(link) {
        // let tempurl = await axios.get('/go_outside_flask/https://www.rei.com');
        try {
            let tempurl = await axios.get('/go_outside_flask/' + link);
            let newurl = tempurl.data;
            // window.location.replace(newurl);
        }
        catch (e) {
            console.log("Error redirecting from link: " + link + " " + e.message);
        }
    }

    const goToLinkTest = async link => {
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

    //return entire function
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

    function ShowWishes() {
        const uiWishes = wishesToShow
        console.log(uiWishes);
        return (
            < div >
                {
                    uiWishes == null ? null :
                        uiWishes.map(({ name, quantity, cost, description, category, link, wishlist, _id }) => (
                            <div className='wish' key={_id}>
                                <div className="wishatt">Category: {category}</div>
                                <div className="wishatt">Item name: {name}</div>
                                <div className="wishatt">Description: {description}</div>
                                <div className="wishatt">Cost: {cost}</div>
                                <a className="wishatt" href="" onClick={(e) => goToLinkTest(link)}>Link: {link}</a>
                                <div className="wishatt">Quantity: {quantity}</div>
                                <div className="wishatt">Wishlist: {wishlist}</div>
                            </div>
                        ))
                }
            </div >
        );
    };

    function HandleFilterChange(e) {
        const wishcheck = wishes.slice();
        const value = e.target.value;

        for (var i = wishcheck.length - 1; i >= 0; i--) {
            if (wishcheck[i].category !== value) {
                wishcheck.splice(i, 1);
            }
        }
        setFilter(value);
        setWishesToShow(wishcheck);

    };

    async function GetWishesList() {
        try {
            let apiresp = await GetWishes()
            setWishes(apiresp);
            setWishesToShow(apiresp);
            setLoading('false');
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

    const mywishes = ShowWishes();



    return (
        <div className="contentwrapper">
            <div className="contentBanner">
                <h1 className="wishTitle">Wishes:</h1>
                <label>
                    <p className="bannerFilter">Category</p>
                    <select name="category" value={filter} onChange={(e) => HandleFilterChange(e)}>
                        <option value="default">Default</option>
                        <option value="camping">Camping</option>
                        <option value="hendrix">Hendrix</option>
                        <option value="decor">Decor</option>
                    </select>
                </label>
            </div>
            <div className="content">
                {mywishes}
            </div>
        </div>
    );
};

export default Wishlist;