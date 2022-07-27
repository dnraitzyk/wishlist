import axios from 'axios';

async function InsertWish(body) {
    try {
        let postdbresp = axios.post(`http://localhost:5000/submitwish`, body, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    catch (e) {
        console.log("Error in Apis.InsertWish: " + e.message);
    }
}


async function GetWishes() {
    try {
        let getdbresp = await axios.get("http://localhost:5000/getwishlists");
        let respdata = getdbresp.data;
        respdata.forEach(function (arrayItem) {
            var id = "";
            if (typeof arrayItem._id === "object") {
                ({ $oid: id } = arrayItem._id);
                arrayItem._id = id;
            }
        });
        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetWishes" + e.message);
    }
};

export { GetWishes, InsertWish };