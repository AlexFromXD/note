#  https://leetcode.com/problems/merge-two-sorted-lists/

from typing import Optional

from list_node import ListNode


class Solution:
    def mergeTwoLists(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = cur = ListNode(0)
        while l1 and l2:
            if l1.val < l2.val:
                cur.next = l1
                l1 = l1.next
            else:
                cur.next = l2
                l2 = l2.next
            cur = cur.next
        cur.next = l1 or l2
        return dummy.next


solution = Solution()
assert solution.mergeTwoLists(
    ListNode(1, ListNode(2, ListNode(4))),
    ListNode(1, ListNode(3, ListNode(4)))) == ListNode(1, ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(4))))))
assert solution.mergeTwoLists(None, None) is None
assert solution.mergeTwoLists(
    ListNode(),
    ListNode(0)) == ListNode(0)
