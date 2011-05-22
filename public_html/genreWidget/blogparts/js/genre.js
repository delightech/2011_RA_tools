search();
function search(reqPage) {
    if (isNaN(reqPage)) reqPage = 1;
    var apiURL = 'http://api.rakuten.co.jp/rws/3.0/json?';
    if (sort == '') sort = '-affiliateRate';
    if (genreId == 0 && (keyword == 'undefined' || keyword == '')) {
        return false;
    }
    if (developerId == 'undefined' || developerId == '') developerId = "e486ffafeed3dd3e47b13157558631b7";
    if (affiliateId == 'undefined' || affiliateId == '') affiliateId = "0bcac755.75c99406.0bcac756.d6fa9ba5";
    var searchData = {
            "developerId": developerId,
            "affiliateId": affiliateId,
            "operation": "ItemSearch",
            "genreId": genreId,
            "version" : "2010-09-15",
            "hits": "5",
            "page": reqPage,
            "sort": sort
    }
    if (keyword != 'undefined' && keyword != '') searchData.keyword = keyword;
    if (NGKeyword != 'undefined' && NGKeyword != '') searchData.NGKeyword = NGKeyword;
    if (minPrice != '') {
        if (isNaN(minPrice)) {
            return false;
        }
        searchData.minPrice = minPrice;
    } else {
        searchData.minPrice = 0;
    }
    if (maxPrice != '') {
        if (isNaN(maxPrice)) {
            return false;
        }
        if (maxPrice >= minPrice) {
            searchData.maxPrice = maxPrice;
        } else {
            return false;
        }
    }
    $.ajax({
        type: 'GET',
        url: apiURL,
        data: searchData,
//                    async: false,
        dataType: 'jsonp',
        jsonp: 'callBack',
        success: function(json) {
            // 初期化
            $('#resultsTitle').remove();
            $('#page_header').remove();
            $('#results').remove();
            $('#page_footer').remove();

            if(json.Header.Status == 'Success') {
                var count = json.Body.ItemSearch.count;
                var page = json.Body.ItemSearch.page;
                var first = json.Body.ItemSearch.first;
                var last = json.Body.ItemSearch.last;
                var totalPageCnt = json.Body.ItemSearch.pageCount;

                if (count > 0) {
                    // ページング
                    $('#rakuten_home').append('<div id="results" />');
                    $('#results').append('<table id="items" width="96" height="600" >');
                    $('#items').append('<tr id="page_header"><td colspan="2">' + calcPagePosition(reqPage, totalPageCnt) + '<br />' +
                            first + '～' + last + '件 (全' + count + '件)</td></tr>');
                    $.each(json.Body.ItemSearch.Items.Item, function(i, item) {
                        //var itemCode  = item.itemCode;
                        var itemName  = item.itemName;
                        var itemPrice = item.itemPrice;
                        //var catchcopy = item.catchcopy;
                        //var itemCaption = item.itemCaption;
                        //var reviewCount   = item.reviewCount;
                        //var reviewAverage = item.reviewAverage;
                        //var itemUrl       = item.itemUrl;
                        var affiliateUrl  = item.affiliateUrl;
                        //var affiliateRate = item.affiliateRate;
                        var imageUrl = 'http://thumbnail.image.rakuten.co.jp/@0_mall/bookcenter/cabinet/noimage.gif?_ex=96x96';
                        if (item.imageFlag == 1) {
                            imageUrl = item.smallImageUrl;
                        }
                        $('#items').append('<tr">' +
                                '<td><a href="' + affiliateUrl + '"><image src="' + imageUrl + '" /></a></td>' +
                                '<td><small><a href="' + affiliateUrl + '">'+ itemName.substring(0, 20) + '</a></small><br />' +
                                '￥' + itemPrice + '</td>' +
                                '</tr>');
                    });
                    //$('#items').append('<tr id="page_footer"><td>' + calcPagePosition(reqPage, totalPageCnt) + '&nbsp;&nbsp;' + first + '～' + last + '件 (全' + count + '件)</td></tr><hr />');
                }
            } else {
                $('#items').append('<h4 id="resultsTitle">error</h4>');
            }
        }
    });
    return false;
}
function paging(page) {
    search(page);
}
function calcPagePosition(reqPage, totalPageCnt) {
    var aTag = '';
    var delta = 3;
    var dispCnt = 5;
    if ((reqPage - delta) > 0 && (reqPage + delta) <= totalPageCnt) {
        for (var i=1; i<dispCnt + 1; i++) {
            // 最後のページまでのリンクを表示したらループ終了
            if (((reqPage - delta) + i) > totalPageCnt) break;
            if (reqPage == ((reqPage - delta) + i)) {
                aTag += '<b>' + reqPage + '</b>|';
            } else {
                aTag += '<a onClick="paging('+ ((reqPage - delta) + i) + ');">' + ((reqPage - delta) + i) + '</a>|';
            }
        }
    } else if ((reqPage - delta) > 0 && (reqPage + delta) > totalPageCnt) {
        for (var i=1; i<dispCnt + 1; i++) {
            var pageNum = (totalPageCnt - dispCnt) + i;
            if (pageNum > totalPageCnt) break;
            if (reqPage == pageNum) {
                aTag += '<b>' + reqPage + '</b>|';
            } else {
                if (pageNum <= 0) continue;
                aTag += '<a onClick="paging('+ pageNum + ');">' + pageNum + '</a>|';
            }
        }
    } else {
        for (var i=1; i<dispCnt + 1; i++) {
            if (i > totalPageCnt) break;
            if (reqPage == i) {
                aTag += '<b>' + reqPage + '</b>|';
            } else {
                if (i <= 0) continue;
                aTag += '<a onClick="paging('+ i + ');">' + i + '</a>|';
            }
        }
    }
    return aTag;
}