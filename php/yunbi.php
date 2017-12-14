<?php

namespace ccxt;

include_once ('acx.php');

class yunbi extends acx {

    public function describe () {
        return array_replace_recursive (parent::describe (), array (
            'id' => 'yunbi',
            'name' => 'YUNBI',
            'countries' => 'CN',
            'rateLimit' => 1000,
            'version' => 'v2',
            'hasCORS' => false,
            'hasFetchTickers' => true,
            'hasFetchOHLCV' => true,
            'timeframes' => array (
                '1m' => '1',
                '5m' => '5',
                '15m' => '15',
                '30m' => '30',
                '1h' => '60',
                '2h' => '120',
                '4h' => '240',
                '12h' => '720',
                '1d' => '1440',
                '3d' => '4320',
                '1w' => '10080',
            ),
            'urls' => array (
                'logo' => 'https://user-images.githubusercontent.com/1294454/28570548-4d646c40-7147-11e7-9cf6-839b93e6d622.jpg',
                'extension' => '.json', // default extension appended to endpoint URLs
                'api' => 'https://yunbi.com',
                'www' => 'https://yunbi.com',
                'doc' => array (
                    'https://yunbi.com/documents/api/guide',
                    'https://yunbi.com/swagger/',
                ),
            ),
            'api' => array (
                'public' => array (
                    'get' => array (
                        'tickers',
                        'tickers/{market}',
                        'markets',
                        'order_book',
                        'k',
                        'depth',
                        'trades',
                        'k_with_pending_trades',
                        'timestamp',
                        'addresses/{address}',
                        'partners/orders/{id}/trades',
                    ),
                ),
                'private' => array (
                    'get' => array (
                        'deposits',
                        'members/me',
                        'deposit',
                        'deposit_address',
                        'order',
                        'orders',
                        'trades/my',
                    ),
                    'post' => array (
                        'order/delete',
                        'orders',
                        'orders/multi',
                        'orders/clear',
                    ),
                ),
            ),
        ));
    }
}

?>