import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { remove as _remove } from 'lodash-es';

/**
 * Cache HTTP GET class
 */
export class HttpCache {
    private static _maxCacheSize: number;
    private static _cache = [];

    static http;

    static maxCacheSize: number = 1000;

    static get(url: string, forceRefresh: boolean = false, tags: any = undefined): Observable<any> {
        const record = HttpCache._cache.find((d) => d.url === url);

        if (record && !forceRefresh) {
            console.log('HttpCache -> get -> FROM CACHE', record);
            return of(record.data);

        } else {
            console.log('HttpCache -> get', url);
            return this.http.get(url).pipe(map(
                (res: any) => {
                    if (res) {
                        this._storeData(url, res, tags);
                    }
                    return res;
                }));
        }
    }

    static getCacheData(urlSubStr: string) {
        return HttpCache._cache.find((d) => d.url.includes(urlSubStr));
    }

    /**
     * remove all cached values with url contain the input sub string
     * @param urlSubStr
     */
    static invalidateCache(urlSubStr: string) {
        return _remove(HttpCache._cache, (d) => d.url.includes(urlSubStr));
    }

    static clearCache() {
        HttpCache._cache = [];
    }

    /**
     * Push <url,data> into _cache object
     * @param url
     * @param data
     */
    private static _storeData(url: string, data, tags: any) {
        const record = HttpCache._cache.find((d) => d.url === url);
        if (!record) {
            if (HttpCache._cache.length >= HttpCache._maxCacheSize) {
                HttpCache._cache.shift(); // remove oldest items if cache size exceeds the limit
            }
            HttpCache._cache.push(Object.assign({ url: url, data: data }, tags ? tags : {}));
        } else {
            record.data = data;
        }
    }
}
