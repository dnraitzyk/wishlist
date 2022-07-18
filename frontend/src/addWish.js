import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import Apis from './apis'

class AddWish extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            cost: 0,
            quantity: 0,
            category: "default",
            link: "",
            wishlist: "Default"
        };
    }


    insertWish() {
        let name = this.state.name
        let description = this.state.description
        let cost = this.state.cost
        let quantity = this.state.quantity
        let link = this.state.link
        let category = this.state.category
        let wishlist = this.state.wishlist
        Apis.InsertWish({ name, description, cost, quantity, category, link, wishlist })
            .then(response => console.log(JSON.stringify(response)))
            .catch(error => console.log('error', error))
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const vals = this.state.description
        this.insertWish()
        // console.log("Cateogry is before " + category)
        // console.log("Clearing fields")
        // setName('')
        // setDescription('')
        // setCost('$0.00')
        // setQuantity(0)
        // setCategory('')
        this.setState({ name: "", description: "", quantity: 0, cost: 0, link: "", category: "default" })
        // console.log("Cateogry is after " + category)
        // setLink('')
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({
            [e.target.name]: value
        });
    }
    // const[name, setName] = useState('')
    // const[description, setDescription] = useState('')
    // const[cost, setCost] = useState("$0.00")
    // const[quantity, setQuantity] = useState(0)
    // const[category, setCategory] = useState('default')
    // const[link, setLink] = useState('')

    // useEffect(() => {
    //     console.log("effect category is " + category);
    // }, [category])


    // const handleSubmitWish = event => {
    //     event.preventDefault();
    //     alert('You have submitted the form.')
    //   } 


    render() {
        return <div className='content'>
            {/* <form onSubmit={handleSubmit}> */}
            <form>
                <fieldset>
                    {/* <label onChange={(e) => setCategory(e.target.value)}> */}
                    <label>
                        <p>Category</p>
                        <select name="category" value={this.state.category} onChange={this.handleChange}>
                            <option value="default">Default</option>
                            <option value="camping">Camping</option>
                            <option value="hendrix">Hendrix</option>
                            <option value="decor">Decor</option>
                        </select>
                    </label>
                    <label>
                        <p>Item Name</p>
                        <input name="name" value={this.state.name} onChange={this.handleChange} />
                    </label>
                    <label>
                        <p>Item Description</p>
                        <input name="description" value={this.state.description} onChange={this.handleChange} />
                    </label>
                    <label>
                        <p>Cost</p>
                        <span className="currencyinput">$
                            <input name="cost" value={this.state.cost} onChange={this.handleChange} />
                        </span>
                    </label>
                    <label>
                        <p>Quantity</p>
                        <input name="quantity" value={this.state.quantity} onChange={this.handleChange} />
                    </label>
                    <label>
                        <p>Link</p>
                        <input name="link" value={this.state.link} onChange={this.handleChange} />
                    </label>
                </fieldset>
                <button className="button-24" type="submit" onClick={this.handleSubmit}>
                    Submit
                </button>
            </form>
        </div >
    };
}

export default AddWish;

