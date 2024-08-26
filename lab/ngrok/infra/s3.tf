resource "aws_s3_bucket" "soruce_code" {
  bucket_prefix = local.vpc_name
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.soruce_code.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_object" "dist" {
  for_each = toset([
    "server.js",
    "package.json",
    "package-lock.json",
  ])

  bucket = aws_s3_bucket.soruce_code.id
  key    = each.key
  source = "${path.module}/../server/${each.key}"
  etag   = filemd5("${path.module}/../server/${each.key}")
}
