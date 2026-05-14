using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bareeq.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddKdsStatusToOrderItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KdsStatus",
                table: "OrderItems",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KdsStatus",
                table: "OrderItems");
        }
    }
}
