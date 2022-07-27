import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { GetWishes, InsertWish } from './apis'

function Wishlist() {

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [filter, setFilter] = useState("Default");
    const [wishes, setWishes] = useState([]);
    const [wishesToShow, setWishesToShow] = useState([]);
    const [loading, setLoading] = useState("initial");
    const [wishlist, setWishlist] = useState("default");
    const [wishcount, setWishCount] = useState(0);

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


    // TODO need to save all _id as object and hexdecimal, create new variable for id unique 
    function ShowWishes() {

        const [showlist, setShowList] = useState(wishesToShow);
        const [prevWish, setPrevWish] = useState();


        // setWishCount(wishesToShow.length);

        const ShowEdit = ({ item }) => {

            const handleEdit = () => {
                item.isReadOnly = false;
                let wishlist = [...wishesToShow]
                setShowList(wishlist);
                setPrevWish({ ...item });
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

        function pushItemToWishlist(item, wishlist) {
            // console.log("item is ", item);
            // console.log("wishlist is ", wishlist);

            wishlist.forEach(function (elem, index, wishlist) {
                // console.log("wishlist item ", wishlist[index]._id);
                // console.log("item ", item._id);
                if (item._id === wishlist[index]._id) {
                    wishlist.splice(index, 1, item);

                }
                // setWishCount(wishlist.length);
                setShowList(wishlist);
            });
        };


        // const handleCancel = (e, prevItem, item) => {
        //     item.isReadOnly = true;

        //     item = JSON.parse(JSON.stringify(prevItem));
        //     console.log("item ", item);

        //     let wishlist = [...wishesToShow]
        //     setShowList(wishlist);
        // }

        const Cancel = (props) => {

            var [prevItem, item] = props.props;

            const handleCancel = () => {

                prevItem.isReadOnly = true;
                let wishlist = wishesToShow.map(check => check._id !== item._id ? check : prevItem);
                setShowList(wishlist);
            };

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

            const handleSubmit = () => {
                insertWish(item);
                item.isReadOnly = true;
                let wishlist = [...wishesToShow]
                setShowList(wishlist);
            };

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
            let wishlist = [...wishesToShow]
            setShowList(wishlist);
        };

        function handleChange(e, item) {
            const { name, value } = e.target;
            // let tempitem = { ...item, [name]: value };
            // pushItemToWishlist(tempitem, wishesToShow);
            item[name] = value;
            let wishlist = [...wishesToShow];
            setShowList(wishlist);

            //special cases
            // if (setter === setVideo) {
            //     setInvalidVideo(!ReactPlayer.canPlay(value))
            // }

        }

        return (
            < div >
                {
                    showlist == null ? null :
                        showlist.map((item) => (
                            <div key={item._id}>
                                <div className='wish' >
                                    <div className="wishatt">
                                        {item.isReadOnly ? (
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
                                                    <Cancel props={[prevWish, item]} />
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

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    const Wish = (item) => {
        const [wish, setWish] = useState(item);
    }

    async function GetWishesList() {
        try {
            let apiresp = await GetWishes();
            apiresp.sort(dynamicSort("-source"));
            var goodlist = apiresp.map(function (item) {
                return { ...item, isReadOnly: true };
            })

            setWishes(goodlist);
            setWishesToShow(goodlist);
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

    // const mywishes = ShowWishes();

    return (
        <div className="contentwrapper">
            <div className="contentBanner">
                <h1 className="wishTitle">Wishes: {wishcount}</h1>
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
                <ShowWishes />
            </div>
        </div>
    );
};

export default Wishlist;