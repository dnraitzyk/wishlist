import axios from 'axios';
import { getLoggedInUser } from '.';

const myaxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

myaxios.interceptors.request.use(
    function (req) {
        const user = getLoggedInUser()
        if (user) {
            if (req.data) {
                req.data.owner = user.username
            }
            req.headers['Authorization'] = 'Bearer ' + user.access_token
        }
        // config.headers['Content-Type'] = 'application/json';
        return req
    },
    (error) => {
        Promise.reject(error)
    }
)

async function SwitchDB(body) {
    try {
        await myaxios.post('/switchDB', body, {
            headers: {
                'content-type': 'application/json'
            }
        });
        setTimeout(function () {
            //do what you need here
        }, 2000);
    }
    catch (e) {
        console.log("Error in Apis.SwitchDB: " + e.message);
    }
}


async function InsertWish(body) {
    try {
        let postdbresp = myaxios.post('/submitwish', body, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    catch (e) {
        console.log("Error in Apis.InsertWish: " + e.message);
    }
}

async function DeleteWish(body) {
    try {
        let postdbresp = myaxios.post('/DeleteWish', body, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    catch (e) {
        console.log("Error in Apis.DeleteWish: " + e.message);
    }
}


async function GetAllWishes() {
    try {
        let getdbresp = await myaxios.get("/GetWishes");
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

async function GetExternalWishes() {
    try {
        let getdbresp = await myaxios.get("/FetchExternalWishes");
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
        console.log("Error in Apis.GetExternalWishes " + e.message);
    }
}


async function InsertWishlist(body) {
    try {
        let postdbresp = myaxios.post('/AddWishlist', body, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    catch (e) {
        console.log("Error in Apis.InsertWishlist: " + e.message);
    }
}

async function DeleteWishlist(body) {
    try {
        let postdbresp = myaxios.post('/DeleteWishlist', body, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
    catch (e) {
        console.log("Error in Apis.DeleteWishlist: " + e.message);
    }
}

async function GetDistinctWishlists() {
    try {
        let getdbresp = await myaxios.get("/GetWishlists");
        let respdata = getdbresp.data;
        respdata.unshift({ '_id': "Default", 'name': 'Default' });

        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetDistinctWishlists " + e.message);
    }
}

async function GetWishlists() {
    try {
        let getdbresp = await myaxios.get("/GetWishlists");
        let respdata = getdbresp.data;
        respdata.forEach(function (arrayItem) {
            let date;
            if (typeof arrayItem.added_date === "object") {
                ({ $date: date } = arrayItem.added_date);
                arrayItem.added_date = date;
            }
        });
        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetWishlists " + e.message);
    }
}


// async function SendCSVContent(body) {
//     const formData = new FormData();
//     formData.append("csvFile", body);
//     console.log("running api sendCSVContent", formData)
//     try {
//         const response = await axios.post( "/downloadCSV", formData, {
//             headers: { "Content-Type": "multipart/form-data", }, responseType: 'arraybuffer',
//         });
//         console.log("response is ", response)
//         const filenameheader = response.headers['content-disposition']
//         const filename = filenameheader.substring(filenameheader.indexOf("=") + 1)
//         console.log(filename)
//         var blobObject = new Blob([response.data], { type: 'text/csv' });

//         const buff = response.data
//         const decoder = new TextDecoder('windows-1252');
//         const text = decoder.decode(buff);
//         console.log("text ", text)
//         return blobObject
//         // return response.data

//     } catch (error) {
//         console.log(error)
//     }
//     return null
// }

export { GetAllWishes, InsertWish, GetDistinctWishlists, GetWishlists, GetExternalWishes, InsertWishlist, DeleteWishlist, DeleteWish, SwitchDB };