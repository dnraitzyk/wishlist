import axios from 'axios';

async function InsertWish(body) {
    try {
        let postdbresp = axios.post(process.env.REACT_APP_BASE_URL + '/submitwish', body, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    catch (e) {
        console.log("Error in Apis.InsertWish: " + e.message);
    }
}


async function GetAllWishes() {
    try {
        console.log("baseurl is " + process.env.REACT_APP_BASE_URL)
        let getdbresp = await axios.get(process.env.REACT_APP_BASE_URL + "/GetWishes");
        let respdata = getdbresp.data;
        respdata.forEach(function (arrayItem) {
            let id = "";
            let date;
            if (typeof arrayItem._id === "object") {
                ({ $oid: id } = arrayItem._id);
                arrayItem._id = id;
            }
            if (typeof arrayItem.modified_date === "object") {
                ({ $date: date } = arrayItem.modified_date);
                arrayItem.modified_date = date;
            }
        });
        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetWishes " + e.message);
    }
}

async function GetDistinctWishlists() {
    try {
        let getdbresp = await axios.get(process.env.REACT_APP_BASE_URL + "/GetWishlists");
        let respdata = getdbresp.data;
        respdata = respdata.map((elem) => elem.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
        );
        // respdata.forEach(function (arrayItem) {
        //     arrayItem = arrayItem.toUpperCase();
        //     //     let id = "";
        //     //     let date;
        //     //     if (typeof arrayItem._id === "object") {
        //     //         ({ $oid: id } = arrayItem._id);
        //     //         arrayItem._id = id;
        //     //     }
        //     //     if (typeof arrayItem.modified_date === "object") {
        //     //         ({ $date: date } = arrayItem.modified_date);
        //     //         arrayItem.modified_date = date;
        //     //     }
        // });
        console.log("distinct wishlist ", respdata);
        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetDistinctWishlists " + e.message);
    }
}

export { GetAllWishes, InsertWish, GetDistinctWishlists };