import smartpy as sp

# FA2 = sp.io.import_template("FA2.py")
from templates import fa2_lib as fa2

@sp.module
def main():
    class TemporarilyLendableNFT(fa2):
        def __init__(self, admin, config):
            fa2.__init__(self, config)

            self.data.ownership=sp.map({'tkey': sp.TNat, 'tvalue': sp.TAddress})
            
            self.data.tempOwnership=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(owner=sp.TAddress, expiration=sp.TTimestamp))
            self.data.royalties=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(royaltyPercentage=sp.TNat, originalOwner=sp.TAddress))
            self.data.admin=admin


        @sp.entrypoint
        def transfer_temporary_ownership(self, params):
            sp.verify(sp.sender == self.data.ownership[params.token_id], message="Not the owner")
            sp.verify(~self.data.tempOwnership.contains(params.token_id), message="Already lent")
            
            self.data.tempOwnership[params.token_id] = sp.record(owner=params.new_owner, expiration=sp.now.add_seconds(params.duration))

        @sp.entrypoint
        def return_ownership(self, token_id):
            sp.verify(self.data.tempOwnership[token_id].expiration < sp.now, message="Loan period not ended")
            
            del self.data.tempOwnership[token_id]

        @sp.entrypoint
        def distribute_royalties(self, params):
            royalty_info = self.data.royalties[params.token_id]
            original_owner = royalty_info.originalOwner
            royalty_amount = params.amount * royalty_info.royaltyPercentage // 100
            
            sp.log(sp.concat("Distributing ", sp.str(royalty_amount)))
            sp.log(sp.concat("To ", sp.str(original_owner)))

        @sp.entrypoint
        def set_royalty_info(self, params):
            self.data.royalties[params.token_id] = sp.record(royaltyPercentage=params.royaltyPercentage, originalOwner=sp.sender)

    # @sp.entry_point
    # def mint(self, params):
    #     sp.verify(sp.sender == self.data.admin, message="Unauthorized")
    #     token_id = params.token_id
    #     amount = params.amount
    #     address = params.address
    #     metadata = params.metadata
    #     self.mint_tokens(token_id, amount, address, metadata)

    # @sp.override
    # def transfer(self, params):
    #     for transfer in params:
    #         sp.verify(self.is_operator(transfer.from_, sp.sender, transfer.token_id), "FA2_NOT_OPERATOR")
    #         sp.verify(~self.data.tempOwnership.contains(transfer.token_id), message="Token is temporarily lent")
    #         self.add_transfer(transfer.from_, transfer.to_, transfer.token_id, transfer.amount)



# @sp.add_test(name="TemporarilyLendableNFT Tests")
# def test():
#     # Initialize test scenario
#     scenario = sp.test_scenario()
#     scenario.h1("Temporarily Lendable NFT Contract Tests")

#     # Mock addresses
#     admin = sp.address("tz1-admin-1234")
#     alice = sp.address("tz1-alice-1234")
#     bob = sp.address("tz1-bob-1234")

#     # Initialize contract and add to scenario
#     config = FA2.FA2_config(single_asset=False)
#     contract = TemporarilyLendableNFT(admin, config)
#     scenario += contract

#     # Test minting a token
#     scenario.h2("Minting a token")
#     scenario += contract.mint(token_id=0, amount=1, address=alice, metadata=sp.map()).run(sender=admin)

#     # Test transferring temporary ownership
#     scenario.h2("Transferring temporary ownership")
#     scenario += contract.transfer_temporary_ownership(token_id=0, new_owner=bob, duration=3600).run(sender=alice)

#     # Test failure case: transferring temporary ownership by non-owner
#     scenario.h2("Transferring temporary ownership by non-owner should fail")
#     scenario += contract.transfer_temporary_ownership(token_id=0, new_owner=bob, duration=3600).run(sender=bob, valid=False)

#     # Test returning ownership after expiration
#     scenario.h2("Returning ownership after expiration")
#     scenario += contract.return_ownership(0).run(valid=False) # Should fail since the duration has not expired
#     scenario += contract.return_ownership(0).run(now=sp.timestamp(3700)) # Succeed after expiration

#     # Test setting and distributing royalties
#     scenario.h2("Setting and distributing royalties")
#     scenario += contract.set_royalty_info(token_id=0, royaltyPercentage=10).run(sender=alice)
#     scenario += contract.distribute_royalties(token_id=0, amount=100).run()



# Example initialization
# admin = sp.address("tz1...")
# config = fa2.FA2_config(single_asset=False)
# my_contract = TemporarilyLendableNFT(admin, config)
