import React, { useState, useEffect } from 'react';
import { GetWishes } from './apis'

function Wishlist() {

    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         name: "",
    //         quantity: 0,
    //         baselink: "",
    //         filter: "Default",
    //         wishes: [],
    //         wishesToShow: [],
    //         loading: 'initial'
    //     };

    //     this.GetWishesList = this.GetWishesList.bind(this);
    //     this.ShowWishes = this.ShowWishes.bind(this);
    //     this.HandleFilterChange = this.HandleFilterChange.bind(this);

    // }

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [baselink, setBaselink] = useState("");
    const [filter, setFilter] = useState("Default");
    const [wishes, setWishes] = useState([]);
    const [wishesToShow, setWishesToShow] = useState([]);
    const [loading, setLoading] = useState("initial");

    useEffect(() => {
        setLoading('true');
        GetWishesList();
    }, []);

    // function componentDidMount() {
    //     setLoading('true');
    //     GetWishesList();

    // };

    function ShowWishes() {
        const uiWishes = wishesToShow
        return (
            < div >
                {
                    uiWishes == null ? null :
                        uiWishes.map(({ name, quantity, cost, description, category, link, _id }) => (
                            <div className='wish' key={_id}>
                                <div className="wishatt">Category: {category}</div>
                                <div className="wishatt">Item name: {name}</div>
                                <div className="wishatt">Description: {description}</div>
                                <div className="wishatt">Cost: {cost}</div>
                                <a className="wishatt" href={link}>Link: {link}</a>
                                <div className="wishatt">Quantity: {quantity}</div>
                            </div>
                        ))
                }
            </div>
        );
    };

    function HandleFilterChange(e) {
        const wishcheck = wishes
        const value = e.target.value;

        for (var i = wishcheck.length - 1; i >= 0; i--) {
            if (wishcheck[i].category !== value) {
                wishcheck.splice(i, 1);
            }
            if (wishcheck[i] != null) { console.log(wishcheck[i].category); }
        }
        setFilter(value);
        setWishesToShow(wishcheck);
        // this.setState({ filter: value, wishesToShow: wishcheck });
    };

    async function GetWishesList() {
        try {
            let apiresp = await GetWishes()
            setWishes(apiresp);
            setWishesToShow(apiresp);
            setLoading('false');
            // this.setState({ wishes: apiresp.data, wishesToShow: apiresp.data, loading: 'false' });
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
            <div className="contentBanner"><h1 className="wishTitle">Wishes:</h1> <label>
                <p className="bannerFilter">Category</p>
                <select name="category" value={filter} onChange={(e) => HandleFilterChange(e)}>
                    <option value="default">Default</option>
                    <option value="camping">Camping</option>
                    <option value="hendrix">Hendrix</option>
                    <option value="decor">Decor</option>
                </select>
            </label></div>
            <div className="content"><div>{mywishes}</div>
            </div>
        </div>
    );
};

export default Wishlist;