import React, { useState } from 'react';
import { InsertWish } from './apis';
import axios from 'axios';


function AddWish() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [category, setCategory] = useState("default");
    const [link, setLink] = useState("");
    const [wishlist, setWishlist] = useState("Default");
    const [errors, setErrors] = useState({ "name": name });
    const [fields, setFields] = useState({ "name": name, "description": description, "cost": cost, "quantity": quantity, "link": link, "category": category });



    async function insertWish() {

        try {
            await InsertWish({ name, description, cost, quantity, category, link, wishlist })
        }
        catch (e) {
            console.log("Error in addWish.insertWish: " + e.message);
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault()

        setErrors({});
        if (handleValidation(fields)) {
            alert("Form submitted");

            insertWish()

            setName("");
            setDescription("");
            setCost("");
            setQuantity("1");
            setLink("");
            setCategory("default");
            setFields({});
        } else {
            alert("Form has errors.");
        }

    }

    const handleValidation = (sfields) => {
        let fields = sfields;
        let errors = {};
        let formIsValid = true;
        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }

        const priceregex = new RegExp(/(?=(?:\.)?\d{1,})^\d{0,}(?:\.)?(?:\d{0,2})$/);
        if (!priceregex.test(fields['cost'])) {
            formIsValid = false;
            errors["cost"] = "Must be a valid price"
        }

        const intregex = new RegExp(/^\d{1,}$/);
        console.log("quantity is ", fields['quantity'])
        if (!intregex.test(fields['quantity'])) {
            formIsValid = false;
            errors["quantity"] = "Must be a valid quantity"
        }
        setErrors(errors);
        return formIsValid;
    }

    const handleChange = setter => event => {

        const { name, value } = event.target;
        setFields({ ...fields, [name]: value });
        //special cases
        // if (setter === setVideo) {
        //     setInvalidVideo(!ReactPlayer.canPlay(value))
        // }

        setter(value)
    }


    return (
        <div className='contentwrapper'>
            <form>
                <fieldset>
                    <label>
                        <p>Category</p>
                        <select name="category" value={category} onChange={handleChange(setCategory)}>
                            <option value="default">Default</option>
                            <option value="camping">Camping</option>
                            <option value="hendrix">Hendrix</option>
                            <option value="decor">Decor</option>
                        </select>
                    </label>
                    <label>
                        <p>Item Name</p>
                        <input name="name" placeholder="Name" value={name} onChange={handleChange(setName)} />
                    </label>
                    <span style={{ color: "red" }}>{errors["name"]}</span>
                    <br />
                    <label>
                        <p>Item Description</p>
                        <input name="description" placeholder="Description" value={description} onChange={handleChange(setDescription)} />
                    </label>
                    <label>
                        <p>Cost</p>
                        <span className="currencyinput">$
                            <input name="cost" placeholder="Cost" value={cost} onChange={handleChange(setCost)} />
                        </span>
                    </label>
                    <span style={{ color: "red" }}>{errors["cost"]}</span>
                    <br />
                    <label>
                        <p>Quantity</p>
                        <input name="quantity" placeholder="Quantity" value={quantity} onChange={handleChange(setQuantity)} />
                    </label>
                    <span style={{ color: "red" }}>{errors["quantity"]}</span>
                    <br />
                    <label>
                        <p>Link</p>
                        <input name="link" placeholder="URL" value={link} onChange={handleChange(setLink)} />
                    </label>
                </fieldset>
                <button className="button-24" type="submit" onClick={(e) => handleSubmit(e)}>
                    Submit
                </button>
            </form>
        </div >
    );
}

export default AddWish;

