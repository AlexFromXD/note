class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __eq__(self, comparision) -> bool:
        if isinstance(comparision, ListNode):
            return self.val == comparision.val and self.next == comparision.next
        else:
            return False
