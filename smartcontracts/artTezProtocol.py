import smartpy as sp
from templates import fa2_lib as fa2


@sp.module
def main():
    class TemporarilyLendableNFT(fa2.main):
        def __init__(self, admin, config, owner_address, token_id, royalty):
            fa2.main.__init__(self, config)

            self.data.ownership = {token_id: owner_address}
            self.data.tempOwnership = {} # tokenID: (new_add, duration)
            self.data.royalties = {token_id: (royalty, owner_address)}

        @sp.entrypoint
        def transfer_temporary_ownership(self, params):
            assert sp.sender == self.data.ownership[params.token_id] # Not the owner
            assert not self.data.tempOwnership.contains(params.token_id) # Already lent
            
            self.data.tempOwnership[params.token_id] = (params.new_owner, sp.add_days(sp.now, params.duration))

        @sp.entrypoint
        def return_ownership(self, token_id):
            assert self.data.tempOwnership[token_id].expiration < sp.now # Loan period not ended
            
            del self.data.tempOwnership[token_id]

        @sp.entrypoint
        def distribute_royalties(self, params):
            royalty_info = self.data.royalties[params.token_id]
            original_owner = royalty_info[1]
            royalty_amount = params.amount * royalty_info[1] / 100

        @sp.entrypoint
        def set_royalty_info(self, params):
            self.data.royalties[params.token_id] = (params.royaltyPercentage, sp.sender)
