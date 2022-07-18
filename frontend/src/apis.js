export default class Apis {
    // Insert an article
    static InsertWish(body) {
        console.log(body)
        return fetch(`http://localhost:5000/submitwish`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)

        })
            .then(response => response.json())
            .catch(error => console.log(error))
    }

    static GetWishes(body) {
        console.log(body)
        return fetch(`http://localhost:5000/getwishlists`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
            // ,
            // body: JSON.stringify(body)

        }).then(response => response.json())
        // .catch(error => console.log(error))
    }

}