## 前言

最近接手了一個 legacy db，裡面用了多種 character_set & collation。為了日後維護方便決定全部改成：

```
character_set: utf8mb4
collation: utf8mb4_unicode_ci
```

至於為什麼選這個組合可以參考[這篇](https://khiav223577.github.io/blog/2019/06/30/MySQL-%E7%B7%A8%E7%A2%BC%E6%8C%91%E9%81%B8%E8%88%87%E5%B7%AE%E7%95%B0%E6%AF%94%E8%BC%83/)

---

## 正文

運氣好的話，可能一行就搞定了：

```sql
ALTER DATABASE `your_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

但如果不幸設定到 foreign key 的欄位就不會被更新。如果情況允許的話，可以先暫時把 constraint 關掉：

```sql
SET FOREIGN_KEY_CHECKS=0;
```

然後 update 單一張 table：

```sql
ALTER table `your_table` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> 根據個人經驗，即使拿掉 constraint 再 alter database ... 還是沒有效果，只能逐一更新每張表。

那如果 table 很多怎麼辦？來寫個迴圈吧。

```sql
DROP PROCEDURE IF EXISTS updateCharSet;
DELIMITER //
CREATE PROCEDURE updateCharSet()
BEGIN
	DECLARE tableName VARCHAR(255);
	DECLARE done int DEFAULT 0;
	DECLARE cur CURSOR FOR SELECT `TABLE_NAME` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'your_db';
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

	OPEN cur;
		tableLoop: LOOP
			IF done THEN
				leave tableLoop;
			END IF;
			FETCH cur INTO tableName;
      -- 可以先跑個select確定有正確抓到table
      -- SELECT tableName;
			SET @s = CONCAT('ALTER table ', tableName, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
			PREPARE stmt FROM @s;
			EXECUTE stmt;
			DEALLOCATE PREPARE stmt;
		END LOOP tableLoop;
	CLOSE cur;
END //

DELIMITER ;
CALL updateCharSet();

```

### 注意事項

- mysql variable 不能直接當變數用，只能 `concat` -> `prepare statement`

- 記得把`DELIMITER`改回`;`，不然可能會花很多時間找莫名其妙的 syntax error

- 如果有把 constraint 拿掉，記得要加回去

  ```sql
  SET FOREIGN_KEY_CHECKS=1;
  ```

- 請自行評估在 production 環境使用的可行性（e.g. downtime）
