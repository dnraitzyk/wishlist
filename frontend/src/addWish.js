import React, { useState } from 'react';
import { InsertWish } from './apis'

function AddWish() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("default");
    const [link, setLink] = useState("");
    const [wishlist, setWishlist] = useState("Default");


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

        insertWish()

        setName("");
        setDescription("");
        setCost(0);
        setQuantity(0);
        setLink("");
        setCategory("default");
    }

    return (<div className='contentwrapper'>
        <form>
            <fieldset>
                <label>
                    <p>Category</p>
                    <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="default">Default</option>
                        <option value="camping">Camping</option>
                        <option value="hendrix">Hendrix</option>
                        <option value="decor">Decor</option>
                    </select>
                </label>
                <label>
                    <p>Item Name</p>
                    <input name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    <p>Item Description</p>
                    <input name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
                    <p>Cost</p>
                    <span className="currencyinput">$
                        <input name="cost" value={cost} onChange={(e) => setCost(e.target.value)} />
                    </span>
                </label>
                <label>
                    <p>Quantity</p>
                    <input name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </label>
                <label>
                    <p>Link</p>
                    <input name="link" value={link} onChange={(e) => setLink(e.target.value)} />
                </label>
            </fieldset>
            <button className="button-24" type="submit" onClick={handleSubmit}>
                Submit
            </button>
        </form>
    </div >
    );
}

export default AddWish;

