import smartpy as sp


class TemporarilyLendableNFT(sp.Contract):
    def __init__(self, admin):
        self.init(
            ownership=sp.map(tkey=sp.TNat, tvalue=sp.TAddress),
            tempOwnership=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(owner=sp.TAddress, expiration=sp.TTimestamp)),
            royalties=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(royaltyPercentage=sp.TNat, originalOwner=sp.TAddress)),
            admin=admin
        )

    @sp.entry_point
    def transfer_temporary_ownership(self, params):
        sp.verify(sp.sender == self.data.ownership[params.token_id], message="Not the owner")
        sp.verify(~self.data.tempOwnership.contains(params.token_id), message="Already lent")
        # ~ is used in smartpy for negation
        
        self.data.tempOwnership[params.token_id] = sp.record(owner=params.new_owner, expiration=sp.now.add_seconds(params.duration))

    @sp.entry_point
    def return_ownership(self, token_id):
        sp.verify(self.data.tempOwnership[token_id].expiration < sp.now, message="Loan period not ended")
        
        del self.data.tempOwnership[token_id]

    @sp.entry_point
    def distribute_royalties(self, params):
        sp.verify(sp.sender == self.data.admin, message="Unauthorized")
        
        #TODO: implement the logic to transfer tokens/funds
        royalty_info = self.data.royalties[params.token_id]
        original_owner = royalty_info.originalOwner
        royalty_amount = params.amount * royalty_info.royaltyPercentage // 100
        
        sp.log(sp.concat("Distributing ", sp.str(royalty_amount)))
        sp.log(sp.concat("To ", sp.str(original_owner)))

    @sp.entry_point
    def set_royalty_info(self, params):
        #TODO decide who sets this and verify them
        self.data.royalties[params.token_id] = sp.record(royaltyPercentage=params.royaltyPercentage, originalOwner=sp.sender)



@sp.add_test(name = "TemporarilyLendableNFT")
def test():
    admin = sp.test_account("Admin")
    alice = sp.test_account("Alice")
    bob = sp.test_account("Bob")
    scenario = sp.test_scenario()
    scenario.h1("Temporarily Lendable NFT")
    contract = TemporarilyLendableNFT(admin.address)
    scenario += contract

    # Setting up an NFT and its royalty information
    scenario += contract.set_royalty_info(token_id=0, royaltyPercentage=10).run(sender=alice)
    # Alice transferring temporary ownership to Bob
    scenario += contract.transfer_temporary_ownership(token_id=0, new_owner=bob.address, duration=31536000).run(sender=alice)
    # Attempt to return ownership before the period ends (should fail)
    scenario += contract.return_ownership(0).run(sender=bob, valid=False)
    # Distributing royalties (simplified representation)
    scenario += contract.distribute_royalties(token_id=0, amount=1000).run(sender=admin)
