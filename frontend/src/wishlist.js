import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import Apis from './apis'

class Wishlist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            quantity: 0,
            baselink: "",
            items: [],
            wishes: [],
            loading: 'initial'
        };

        this.GetWishesList = this.GetWishesList.bind(this);
        this.ShowWishes = this.ShowWishes.bind(this);

    }

    componentDidMount() {
        this.setState({ loading: true });
        this.GetWishesList();

    }

    ShowWishes() {
        // console.log(this.state.wishes);
        const wishwish = this.state.wishes;
        return (
            <div>
                {
                    this.state.wishes.data == null ? null :
                        this.state.wishes.data.map(({ name, quantity, cost, description, category, link }) => (
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

    GetWishesList() {
        console.log("Gettings wishes");
        wishes: Apis.GetWishes({}).then(function (response) { return response; }).then(data => {
            this.setState({ wishes: data, loading: 'false' });
        })
        // response => this.ShowWishes(response)).json });
        // return getdata
        // console.log("response is "+ resp);
        // const getdata = await get.json();
        // console.log("get data is " + getdata);
        // this.setState({s name: getdata.name })
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
            <div className="content">
                <h1 className="wishTitle">Wishes:</h1>
                <div>{mywishes}</div>
            </div>
        );
    };
}

export default Wishlist;