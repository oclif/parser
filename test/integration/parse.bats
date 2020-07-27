@test "parse stdin as arg" {
  result="$(echo foo | ./test/integration/parse)"
  echo $result
  [ "$result" = "foo" ]
}

@test "parse multiline stdin as arg" {
  result="$(echo "foo\nbar" | ./test/integration/parse)"
  echo $result
  [ "$result" = "foo\nbar" ]
}

#@test "parse no stdin as undefined" {
#  result="$(./test/integration/parse)"
#  echo $result
#  [ "$result" = "undefined" ]
#}