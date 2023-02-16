resource "local_file" "each_season" {
  for_each = zipmap(var.season, var.season)

  filename = "${each.value}.each.txt"
  content  = ""
}
