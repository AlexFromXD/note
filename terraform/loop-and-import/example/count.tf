resource "local_file" "count_season" {
  count = length(var.season)

  filename = "${var.season[count.index]}.count.txt"
  content  = ""
}
