import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import Apis from './apis'

class Wishlist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            quantity: 0,
            baselink: ""
        };
        this.getWishes = this.getWishes.bind(this);
        // this.getWishes();
    }

    getWishes = async () => {
        console.log("Getting wishes");
        const get = await Apis.GetWishes({});
        console.log("get is " + get);
        const getdata = await get.json();
        console.log("get data is " + getdata);
        this.setState({ name: getdata.name })
    };

    render() {
        return <div>
            <p>this.state.name</p>
            {this.getWishes()}
        </div>
    };
}

export default Wishlist;