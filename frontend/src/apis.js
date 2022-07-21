import axios from 'axios';

async function InsertWish(body) {
    try {
        let postdbresp = axios.post(`http://localhost:5000/submitwish`, body)
    }
    catch (e) {
        console.log("Error in Apis.InsertWish: " + e.message);
    }
}


async function GetWishes() {
    try {
        let getdbresp = await axios.get("http://localhost:5000/getwishlists");
        let respdata = getdbresp.data;
        for (let i = 0; i < respdata.length; i++) {
            respdata[i]._id = respdata[i]._id.$oid;
        }
        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetWishes" + e.message);
    }
};

export { GetWishes, InsertWish };