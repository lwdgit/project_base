<? 
    //if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        require('../data/core/db.php');
        require('../library/function.php');
        require('../inc/conf.php');


        $sql="SELECT * FROM  `articles` where catagory=1 order by articles.id desc";
        $query=$db->query($sql);
        $total_num= mysql_num_rows($query);
        $page = safeGet('page');
        $page_size = safeGet('page_size');

        if (is_null($page)) $page = 1;
        if (is_null($page_size)) $page_size=10;

        $page = intval($page);
        $page_size = intval($page_size);
        $start=($page-1)*$page_size;
        $total_page=ceil($total_num/$page_size);

          
        $skipRow = $page_size * ($page - 1);
        $skipRow = $skipRow >= $total_num ? $total_num : $skipRow;

        if ($skipRow == $total_num) {
            echo makeData('[]');
            return;
        }

        mysql_data_seek($query, $skipRow);
   
        $htmlStr = '<ol>';
        $fetchRow = 0;
        while($fetchRow++ < $page_size && $row=mysql_fetch_array($query)) {

            //print_r($row);
            $articleList[] = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'hot' => $row['hot'],
                'tags' => array_unique(split('\|', $row['mark'])),
                'date' => substr($row['time'], 0, 10),
                'timestamp' => strtotime($row['time'])
            );
        }

        echo makeData($articleList, safeGet('callback'));
    //}
?>