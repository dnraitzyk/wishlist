import React from 'react';
import ReactDOM from "react-dom";
import { GetWishes } from './apis'

class Wishlist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            quantity: 0,
            baselink: "",
            filter: "Default",
            wishes: [],
            wishesToShow: [],
            loading: 'initial'
        };

        this.GetWishesList = this.GetWishesList.bind(this);
        this.ShowWishes = this.ShowWishes.bind(this);
        this.HandleFilterChange = this.HandleFilterChange.bind(this);

    }

    componentDidMount() {
        this.setState({ loading: true });
        this.GetWishesList();

    }

    ShowWishes() {
        const uiWishes = this.state.wishesToShow
        return (
            < div >
                {
                    uiWishes == null ? null :
                        uiWishes.map(({ name, quantity, cost, description, category, link }) => (
                            <div className='wish' key={cost}>
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
    }

    HandleFilterChange = (e) => {
        const wishcheck = this.state.wishes
        const value = e.target.value;

        for (var i = wishcheck.length - 1; i >= 0; i--) {
            if (wishcheck[i].category !== value) {
                wishcheck.splice(i, 1);
            }
            if (wishcheck[i] != null) { console.log(wishcheck[i].category); }
        }
        this.setState({ filter: value, wishesToShow: wishcheck });
    }

    async GetWishesList() {
        try {
            let apiresp = await GetWishes()
            this.setState({ wishes: apiresp.data, wishesToShow: apiresp.data, loading: 'false' });
        }
        catch (e) {
            console.log("Error in Wishlist.GetWishesList: " + e.message);
        }
    }

    render() {
        if (this.state.loading === 'initial') {
            return <h2 className="content">Initializing...</h2>;
        }

        if (this.state.loading === 'true') {
            return <h2 className="content">Loading...</h2>;
        }

        const mywishes = this.ShowWishes();

        return (
            <div className="contentwrapper">
                <div className="contentBanner"><h1 className="wishTitle">Wishes:</h1> <label>
                    <p className="bannerFilter">Category</p>
                    <select name="category" value={this.state.filter} onChange={this.HandleFilterChange}>
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
}

export default Wishlist;