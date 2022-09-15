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

async function GetExternalWishes() {
    try {
        let getdbresp = await axios.get(process.env.REACT_APP_BASE_URL + "/FetchExternalWishes");
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
        let postdbresp = axios.post(process.env.REACT_APP_BASE_URL + '/AddWishlist', body, {
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
        let postdbresp = axios.post(process.env.REACT_APP_BASE_URL + '/DeleteWishlist', body, {
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
        let getdbresp = await axios.get(process.env.REACT_APP_BASE_URL + "/GetWishlists");
        let respdata = getdbresp.data;
        // respdata = respdata.map((elem) => elem.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) );

        return respdata;
    }
    catch (e) {
        console.log("Error in Apis.GetDistinctWishlists " + e.message);
    }
}

async function GetWishlists() {
    try {
        let getdbresp = await axios.get(process.env.REACT_APP_BASE_URL + "/GetWishlists");
        let respdata = getdbresp.data;
        // respdata = respdata.map((elem) => elem.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) );
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
//         const response = await axios.post(process.env.REACT_APP_BASE_URL + "/downloadCSV", formData, {
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

export { GetAllWishes, InsertWish, GetDistinctWishlists, GetWishlists, GetExternalWishes, InsertWishlist, DeleteWishlist };