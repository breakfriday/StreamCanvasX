class FetchStreamLoader {
    static isSupported() {
        if (window.fetch && window.ReadableStream) {
             return true;
        } else {
            console.log('Fetch and Stream API are not supported');
            return false;
        }
    }

    async fetchStream(url: string) {
        let headers = new Headers();
        let params = {
            method: 'GET',
            headers: headers,
            mode: 'cors',
            credentials: 'include',
            cache: 'default',
        };
        fetch(url, params).then(response => {

          });

        try {
            let res = await fetch(url, params);
        } catch (e) {

        }
    }

    abort() {

    }
}