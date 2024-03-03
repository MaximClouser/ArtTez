import smartpy as sp
from templates import fa2_lib as fa2


@sp.module
def main():
    class TemporarilyLendableNFT(fa2.main.Nft):
        def __init__(self, admin, config, owner_address, new_address, token_id, duration, royalty):
            fa2.main.Nft.__init__(self, config)

            self.data.ownership= {token_id: owner_address}
            self.data.tempOwnership={} # tokenID: (new_add, duration)
            self.data.royalties={token_id: (royalty, owner_address)}


        @sp.entrypoint
        def transfer_temporary_ownership(self, params):
            assert sp.sender == self.data.ownership[params.token_id] # Not the owner
            assert ~self.data.tempOwnership.contains(params.token_id) # Already lent
            
            self.data.tempOwnership[params.token_id] = sp.record(owner=params.new_owner, expiration=sp.now.add_seconds(params.duration))
            print("DONE")

        @sp.entrypoint
        def return_ownership(self, token_id):
            assert self.data.tempOwnership[token_id].expiration < sp.now # Loan period not ended
            
            del self.data.tempOwnership[token_id]

        @sp.entrypoint
        def distribute_royalties(self, params):
            royalty_info = self.data.royalties[params.token_id]
            original_owner = royalty_info[1]
            royalty_amount = params.amount * royalty_info[1] / 100
            print("DONE")

        @sp.entrypoint
        def set_royalty_info(self, params):
            self.data.royalties[params.token_id] = (params.royaltyPercentage, sp.sender)



@sp.add_test()
def test():
    scenario = sp.test_scenario("TemporarilyLendableNFT", [fa2.t, fa2.main, main])
    scenario.h1("TemporarilyLendableNFT")

   # Define test accounts
    admin = sp.test_account("Admin")
    owner = sp.test_account("Owner")
    new_owner = sp.test_account("NewOwner")

    # Contract parameters
    token_id = 0
    duration = 3600  # 1 hour in seconds
    royalty_percentage = 10  # 10%

    # Initialize the contract
    c = main.TemporarilyLendableNFT(
        admin=admin.address,
        config=...,  # Replace with appropriate config
        owner_address=owner.address,
        new_address=new_owner.address,
        token_id=token_id,
        duration=duration,
        royalty=royalty_percentage
    )
    scenario += c

    # Test 1: Transfer temporary ownership
    scenario.h2("Transfer Temporary Ownership")
    transfer_params = sp.record(token_id=token_id, new_owner=new_owner.address, duration=duration)
    scenario += c.transfer_temporary_ownership(transfer_params).run(sender=owner.address)

    # Test 2: Return ownership
    scenario.h2("Return Ownership")
    sp.add_delay(duration)
    scenario += c.return_ownership(token_id).run(sender=new_owner.address)
